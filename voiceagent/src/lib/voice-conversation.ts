import "server-only";

export async function generateVoiceReply(params: {
  systemPrompt: string;
  knowledgeContext?: string;
  history: Array<{ role: string; content: string }>;
  userMessage: string;
}): Promise<{ text: string; shouldTransfer: boolean; transferSummary?: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      text: "I'm having trouble connecting to my assistant right now. Please try again shortly.",
      shouldTransfer: false,
    };
  }

  let system = params.systemPrompt;
  if (params.knowledgeContext) {
    system += `\n\nKnowledge base:\n${params.knowledgeContext}`;
  }
  system +=
    "\n\nKeep responses under 2 sentences for phone calls. If the caller wants a human, say you'll transfer them and respond with [TRANSFER].";

  const messages = [
    { role: "system", content: system },
    ...params.history.map((h) => ({
      role: h.role === "assistant" ? "assistant" : "user",
      content: h.content,
    })),
    { role: "user", content: params.userMessage },
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      max_tokens: 200,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    return {
      text: "Sorry, I didn't catch that. Could you repeat?",
      shouldTransfer: false,
    };
  }

  const data = await res.json();
  let text: string = data.choices?.[0]?.message?.content || "How can I help?";
  const shouldTransfer = text.includes("[TRANSFER]") || /speak to (a |an )?human|transfer/i.test(text);
  text = text.replace("[TRANSFER]", "").trim();

  return {
    text,
    shouldTransfer,
    transferSummary: shouldTransfer ? `Caller request: ${params.userMessage}` : undefined,
  };
}
