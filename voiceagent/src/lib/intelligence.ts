import { chatCompletion, hasOpenRouter } from "./openrouter";

export interface CallIntelligence {
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  intent: string;
  topics: string[];
  actionItems: string[];
  score: number;
}

function formatTranscript(transcripts: Array<{ role: string; content: string }>) {
  return transcripts
    .map((t) => `${t.role}: ${t.content}`)
    .join("\n")
    .trim();
}

export async function analyzeCall(
  transcripts: Array<{ role: string; content: string }>,
  agentName = "Agent"
): Promise<CallIntelligence> {
  const transcript = formatTranscript(transcripts);

  if (!hasOpenRouter() || !transcript) {
    return {
      summary: transcript
        ? "Call completed. Enable OPENROUTER_API_KEY for AI analysis."
        : "Call completed with no transcript.",
      sentiment: "neutral",
      intent: "unknown",
      topics: [],
      actionItems: [],
      score: 50,
    };
  }

  const content = await chatCompletion({
    messages: [
      {
        role: "system",
        content: `Analyze this phone call transcript for agent "${agentName}". Return JSON only with: summary (2 sentences), sentiment (positive/neutral/negative), intent (short phrase describing caller goal), topics (array), actionItems (array), score (0-100 call quality).`,
      },
      { role: "user", content: transcript },
    ],
    temperature: 0.3,
    max_tokens: 500,
    jsonMode: true,
  });

  if (!content) {
    return {
      summary: "Analysis unavailable.",
      sentiment: "neutral",
      intent: "unknown",
      topics: [],
      actionItems: [],
      score: 50,
    };
  }

  try {
    const parsed = JSON.parse(content) as Partial<CallIntelligence>;
    return {
      summary: parsed.summary || "Call analyzed.",
      sentiment: parsed.sentiment || "neutral",
      intent: parsed.intent || "general inquiry",
      topics: parsed.topics || [],
      actionItems: parsed.actionItems || [],
      score: parsed.score ?? 50,
    };
  } catch {
    return {
      summary: content.slice(0, 200),
      sentiment: "neutral",
      intent: "unknown",
      topics: [],
      actionItems: [],
      score: 50,
    };
  }
}
