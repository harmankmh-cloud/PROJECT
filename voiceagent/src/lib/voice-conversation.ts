import "server-only";
import { chatCompletionVoice, hasOpenRouter } from "./openrouter";

export async function generateVoiceReply(params: {
  systemPrompt: string;
  knowledgeContext?: string;
  history: Array<{ role: string; content: string }>;
  userMessage: string;
}): Promise<{ text: string; shouldTransfer: boolean; transferSummary?: string }> {
  if (!hasOpenRouter()) {
    return {
      text: "I'm having trouble connecting to my assistant right now. Please add OPENROUTER_API_KEY.",
      shouldTransfer: false,
    };
  }

  let system = params.systemPrompt;
  if (params.knowledgeContext) {
    system += `\n\nKnowledge base:\n${params.knowledgeContext}`;
  }
  system +=
    "\n\nLive phone call rules: ONE short sentence, under 15 words, plain spoken English. No lists or markdown. If they want a human, say you'll transfer them and include [TRANSFER].";

  const recentHistory = params.history.slice(-4);

  const content = await chatCompletionVoice({
    messages: [
      { role: "system", content: system },
      ...recentHistory.map((h) => ({
        role: h.role === "assistant" ? "assistant" : "user",
        content: h.content,
      })),
      { role: "user", content: params.userMessage },
    ],
    max_tokens: 50,
    temperature: 0.2,
  });

  if (!content) {
    return {
      text: "Sorry, I didn't catch that. Could you repeat?",
      shouldTransfer: false,
    };
  }

  let text = content;
  const shouldTransfer =
    text.includes("[TRANSFER]") || /speak to (a |an )?human|transfer/i.test(text);
  text = text.replace("[TRANSFER]", "").trim();

  return {
    text,
    shouldTransfer,
    transferSummary: shouldTransfer ? `Caller request: ${params.userMessage}` : undefined,
  };
}
