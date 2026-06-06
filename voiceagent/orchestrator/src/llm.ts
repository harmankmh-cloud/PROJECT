import OpenAI from "openai";
import type { ToolCallResult } from "./types.js";

const DEFAULT_MODEL =
  process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001";

const VOICE_TIMEOUT_MS = Number(process.env.ORCHESTRATOR_LLM_TIMEOUT_MS || 10000);

export class LlmSession {
  private client: OpenAI | null = null;
  private messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
  private apiKeyMissing = false;

  constructor(
    private systemPrompt: string,
    private knowledgeContext?: string,
    private contactMemory?: string
  ) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      this.apiKeyMissing = true;
      return;
    }

    this.client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002",
        "X-Title": "VoiceAgent",
      },
    });

    let fullSystem = systemPrompt;
    if (knowledgeContext) {
      fullSystem += `\n\nKnowledge base:\n${knowledgeContext.slice(0, 1500)}`;
    }
    if (contactMemory) {
      fullSystem += `\n\nCaller history:\n${contactMemory.slice(0, 500)}`;
    }
    fullSystem +=
      "\n\nLive phone call rules: ONE short spoken sentence, under 18 words, natural and direct. No lists or markdown. Never say sure, okay, got it, or apologize for delays. Answer the question directly. If the caller wants a human, say you'll transfer them and include [TRANSFER].";

    this.messages.push({ role: "system", content: fullSystem });
  }

  async respondStream(
    userText: string,
    onToken: (token: string) => void
  ): Promise<{ text: string; toolResult: ToolCallResult | null }> {
    if (this.apiKeyMissing || !this.client) {
      const text = "I'm having trouble connecting right now. Please try again in a moment.";
      onToken(text);
      return { text, toolResult: null };
    }

    this.messages.push({ role: "user", content: userText });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), VOICE_TIMEOUT_MS);

    let streamedAny = false;

    try {
      const stream = await this.client.chat.completions.create(
        {
          model: DEFAULT_MODEL,
          messages: this.messages,
          max_tokens: 45,
          temperature: 0.3,
          stream: true,
        },
        { signal: controller.signal }
      );

      let text = "";
      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || "";
        if (!token) continue;
        text += token;
        streamedAny = true;
        onToken(token);
      }

      text = text.trim() || "Could you repeat that?";
      const shouldTransfer =
        text.includes("[TRANSFER]") || /speak to (a |an )?human|transfer/i.test(text);
      text = text.replace("[TRANSFER]", "").trim();

      this.messages.push({ role: "assistant", content: text });

      return {
        text,
        toolResult: shouldTransfer
          ? { action: "transfer", handoffSummary: `Caller request: ${userText}` }
          : null,
      };
    } catch (err) {
      console.error("LLM stream failed:", err);
      const text = streamedAny ? "" : "Could you repeat that?";
      if (text) onToken(text);
      if (text) this.messages.push({ role: "assistant", content: text });
      return { text: text || "Could you repeat that?", toolResult: null };
    } finally {
      clearTimeout(timer);
    }
  }

  handleInterrupt(utteranceUntilInterrupt?: string) {
    if (utteranceUntilInterrupt) {
      const lastAssistant = [...this.messages].reverse().find((m) => m.role === "assistant");
      if (lastAssistant && typeof lastAssistant.content === "string") {
        const truncated = lastAssistant.content.slice(0, utteranceUntilInterrupt.length);
        lastAssistant.content = truncated;
      }
    }
  }
}
