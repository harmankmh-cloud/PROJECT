import "server-only";
import { BRAND } from "./brand";

const MODEL_CHAIN = [
  process.env.OPENROUTER_MODEL,
  "google/gemini-2.0-flash-001",
  "meta-llama/llama-3.1-8b-instruct:free",
  "openrouter/free",
].filter(Boolean) as string[];

const VOICE_MODEL_CHAIN = [
  process.env.OPENROUTER_MODEL,
  "google/gemini-2.0-flash-001",
].filter(Boolean) as string[];

export function hasOpenRouter() {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

type ChatMessage = { role: string; content: string };

export async function chatCompletion(params: {
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  jsonMode?: boolean;
}): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  for (const model of MODEL_CHAIN) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002",
          "X-Title": BRAND.name,
        },
        body: JSON.stringify({
          model,
          messages: params.messages,
          max_tokens: params.max_tokens ?? 200,
          temperature: params.temperature ?? 0.7,
          ...(params.jsonMode ? { response_format: { type: "json_object" } } : {}),
        }),
        signal: AbortSignal.timeout(params.max_tokens && params.max_tokens <= 100 ? 5000 : 8000),
      });

      if (!res.ok) continue;

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      if (content) return content;
    } catch {
      continue;
    }
  }

  return null;
}

export async function chatCompletionVoice(params: {
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
}): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  for (const model of VOICE_MODEL_CHAIN) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002",
          "X-Title": BRAND.name,
        },
        body: JSON.stringify({
          model,
          messages: params.messages,
          max_tokens: params.max_tokens ?? 60,
          temperature: params.temperature ?? 0.3,
        }),
        signal: AbortSignal.timeout(3500),
      });

      if (!res.ok) continue;

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      if (content) return content;
    } catch {
      continue;
    }
  }

  return null;
}
