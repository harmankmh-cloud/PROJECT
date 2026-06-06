import "server-only";

export interface CallAnalysis {
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  intent: string;
  complianceFlags: string[];
}

export async function analyzeCall(
  transcripts: Array<{ role: string; content: string }>
): Promise<CallAnalysis> {
  const text = transcripts.map((t) => `${t.role}: ${t.content}`).join("\n");

  if (!text.trim()) {
    return {
      summary: "No conversation recorded",
      sentiment: "neutral",
      intent: "unknown",
      complianceFlags: [],
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      summary: text.slice(0, 200),
      sentiment: "neutral",
      intent: "general_inquiry",
      complianceFlags: [],
    };
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              'Analyze this phone call transcript. Return JSON: {"summary":"...","sentiment":"positive|neutral|negative","intent":"...","complianceFlags":[]}. complianceFlags may include: recording_disclosure_missing, phi_detected, aggressive_language.',
          },
          { role: "user", content: text },
        ],
        response_format: { type: "json_object" },
        max_tokens: 300,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const parsed = JSON.parse(data.choices[0].message.content);
      return {
        summary: parsed.summary || text.slice(0, 200),
        sentiment: parsed.sentiment || "neutral",
        intent: parsed.intent || "general_inquiry",
        complianceFlags: parsed.complianceFlags || [],
      };
    }
  } catch {
    // fall through
  }

  return {
    summary: text.slice(0, 200),
    sentiment: "neutral",
    intent: "general_inquiry",
    complianceFlags: [],
  };
}
