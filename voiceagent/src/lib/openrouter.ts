import "server-only";
import { BRAND } from "./brand";

function normalizeModelId(value?: string) {
  if (!value) return undefined;
  return value.trim().replace(/^OPENROUTER_MODEL=/i, "");
}

const MODEL_CHAIN = [
  normalizeModelId(process.env.OPENROUTER_MODEL),
  "google/gemini-2.5-flash",
  "google/gemini-3.5-flash",
  "meta-llama/llama-3.3-70b-instruct:free",
  "openrouter/free",
].filter(Boolean) as string[];

const VOICE_MODEL_CHAIN = [
  normalizeModelId(process.env.OPENROUTER_MODEL),
  "google/gemini-2.5-flash",
  "google/gemini-3.5-flash",
].filter(Boolean) as string[];

export function hasOpenRouter() {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

type ChatMessage = { role: string; content: string };

/** Scale fetch timeout with expected output size — strategist runs need ~20–40s. */
function completionTimeoutMs(maxTokens = 200): number {
  if (maxTokens <= 100) return 5_000;
  if (maxTokens <= 500) return 15_000;
  if (maxTokens <= 1_500) return 30_000;
  return 60_000;
}

export async function chatCompletion(params: {
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  jsonMode?: boolean;
  model?: string;
  timeoutMs?: number;
}): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const chain = params.model
    ? [params.model, ...MODEL_CHAIN.filter((m) => m !== params.model)]
    : MODEL_CHAIN;

  for (const model of chain) {
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
        signal: AbortSignal.timeout(
          params.timeoutMs ?? completionTimeoutMs(params.max_tokens ?? 200),
        ),
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
  model?: string;
}): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const chain = params.model
    ? [params.model, ...VOICE_MODEL_CHAIN.filter((m) => m !== params.model)]
    : VOICE_MODEL_CHAIN;

  for (const model of chain) {
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
