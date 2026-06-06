import type { ToolCallResult } from "./types.js";

const MODEL_CHAIN = [
  process.env.OPENROUTER_MODEL,
  "google/gemini-2.5-flash",
  "google/gemini-3.5-flash",
  "meta-llama/llama-3.3-70b-instruct:free",
  "openrouter/free",
].filter(Boolean) as string[];

const VOICE_TIMEOUT_MS = Number(process.env.ORCHESTRATOR_LLM_TIMEOUT_MS || 12000);

type ChatMessage = { role: string; content: string };

export class LlmSession {
  private apiKey: string | null = null;
  private messages: ChatMessage[] = [];

  constructor(
    private systemPrompt: string,
    private knowledgeContext?: string,
    private contactMemory?: string
  ) {
    this.apiKey = process.env.OPENROUTER_API_KEY || null;
    if (!this.apiKey) {
      console.error("OPENROUTER_API_KEY missing in orchestrator");
      return;
    }

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
    console.log("LLM ready", { models: MODEL_CHAIN.slice(0, 2) });
  }

  private async complete(): Promise<string | null> {
    if (!this.apiKey) return null;

    for (const model of MODEL_CHAIN) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002",
            "X-Title": "VoiceAgent",
          },
          body: JSON.stringify({
            model,
            messages: this.messages,
            max_tokens: 60,
            temperature: 0.3,
          }),
          signal: AbortSignal.timeout(VOICE_TIMEOUT_MS),
        });

        if (!res.ok) {
          const errBody = await res.text();
          console.warn("OpenRouter error", { model, status: res.status, body: errBody.slice(0, 200) });
          continue;
        }

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content?.trim();
        if (content) {
          console.log("OpenRouter ok", { model, chars: content.length });
          return content;
        }
      } catch (err) {
        console.warn("OpenRouter request failed", { model, err });
      }
    }

    return null;
  }

  async respondStream(
    userText: string,
    onToken: (token: string) => void
  ): Promise<{ text: string; toolResult: ToolCallResult | null }> {
    if (!this.apiKey) {
      const text = "My assistant is not configured yet. Please add OPENROUTER_API_KEY.";
      onToken(text);
      return { text, toolResult: null };
    }

    this.messages.push({ role: "user", content: userText });

    const raw = await this.complete();
    if (!raw) {
      const text = "What can I help you with today?";
      onToken(text);
      this.messages.push({ role: "assistant", content: text });
      return { text, toolResult: null };
    }

    const shouldTransfer =
      raw.includes("[TRANSFER]") || /speak to (a |an )?human|transfer/i.test(raw);
    const text = raw.replace("[TRANSFER]", "").trim();

    const parts = text.match(/\S+\s*/g) || [text];
    for (const part of parts) {
      onToken(part);
    }

    this.messages.push({ role: "assistant", content: text });

    return {
      text,
      toolResult: shouldTransfer
        ? { action: "transfer", handoffSummary: `Caller request: ${userText}` }
        : null,
    };
  }

  handleInterrupt(utteranceUntilInterrupt?: string) {
    if (utteranceUntilInterrupt) {
      const lastAssistant = [...this.messages].reverse().find((m) => m.role === "assistant");
      if (lastAssistant) {
        lastAssistant.content = lastAssistant.content.slice(0, utteranceUntilInterrupt.length);
      }
    }
  }
}
