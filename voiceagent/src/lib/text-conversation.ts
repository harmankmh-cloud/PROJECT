import "server-only";
import { chatCompletion, hasOpenRouter } from "./openrouter";

export async function generateTextReply(params: {
  systemPrompt: string;
  knowledgeContext?: string;
  userMessage: string;
  channel: "sms" | "whatsapp" | "web_chat";
}): Promise<string> {
  if (!hasOpenRouter()) {
    return "Thanks for your message. Our team will follow up shortly.";
  }

  let system = params.systemPrompt;
  if (params.knowledgeContext) {
    system += `\n\nKnowledge base:\n${params.knowledgeContext}`;
  }
  system += `\n\n${params.channel === "whatsapp" ? "WhatsApp" : "SMS"} rules: 1-3 short sentences, plain text, no markdown. Be helpful and concise.`;

  const content = await chatCompletion({
    messages: [
      { role: "system", content: system },
      { role: "user", content: params.userMessage },
    ],
    max_tokens: 120,
    temperature: 0.4,
  });

  return content || "Got it — someone from our team will get back to you soon.";
}
