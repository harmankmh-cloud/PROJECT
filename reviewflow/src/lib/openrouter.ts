import { BRAND } from "./brand";
import { buildFallbackReviewOptions } from "./review-fallbacks";

type GenerateReviewInput = {
  businessName: string;
  businessType: string;
  tone: string;
  starRating: number;
  customerNotes: string;
  customInstruction: string;
};

const MODEL_CHAIN = [
  process.env.OPENROUTER_MODEL,
  "google/gemini-2.0-flash-001",
  "openrouter/free",
].filter(Boolean) as string[];

function fallbacks(input: GenerateReviewInput): string[] {
  return buildFallbackReviewOptions({
    businessName: input.businessName,
    starRating: input.starRating,
    customerNotes: input.customerNotes,
  });
}

export async function generateReviewOptions(input: GenerateReviewInput): Promise<string[]> {
  const backup = fallbacks(input);
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return backup;
  }

  const systemPrompt = `You help customers write honest Google reviews for local businesses.
Tone: ${input.tone}. Match the star rating honestly. Never invent facts. Never be rude.
Reply with exactly 3 review options separated by the line --- on its own line. No numbering, no JSON.`;

  const userPrompt = `Business: ${input.businessName} (${input.businessType})
Star rating: ${input.starRating}/5
Customer notes: ${input.customerNotes}
Extra instruction: ${input.customInstruction || "none"}

Write 3 different Google review options.`;

  for (const model of MODEL_CHAIN) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": BRAND.name,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.85,
          max_tokens: 600,
        }),
      });

      if (!response.ok) continue;

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content?.trim() || "";
      const parsed = parseReviewOptions(raw);

      if (parsed.length >= 3) return parsed.slice(0, 3);
      if (parsed.length > 0) {
        const merged = [...parsed];
        for (const item of backup) {
          if (merged.length >= 3) break;
          if (!merged.includes(item)) merged.push(item);
        }
        return merged.slice(0, 3);
      }
    } catch {
      continue;
    }
  }

  return backup;
}

function parseReviewOptions(raw: string): string[] {
  if (!raw) return [];

  const byDivider = raw
    .split(/\n---\n|\n---|\r---\r/)
    .map((part) => part.replace(/^\d+[\).\s]+/, "").trim())
    .filter((part) => part.length > 15);

  if (byDivider.length >= 2) return byDivider;

  try {
    const cleaned = raw.replace(/^```json?\s*|\s*```$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => typeof item === "string" && item.trim().length > 10);
    }
  } catch {
    /* try line split */
  }

  const byLines = raw
    .split(/\n+/)
    .map((line) => line.replace(/^\d+[\).\s]+|^[-*]\s+/, "").trim())
    .filter((line) => line.length > 20);

  if (byLines.length >= 2) return byLines;

  return [];
}

export async function generateSocialCaption(input: {
  businessName: string;
  reviewText: string;
}): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = MODEL_CHAIN[0] || "openrouter/free";

  if (!apiKey) {
    return `Another happy customer at ${input.businessName}! Thanks for the kind words.`;
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": BRAND.name,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: `Turn this review into a short social caption for ${input.businessName}. Add 3 hashtags.\n\n${input.reviewText}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 180,
    }),
  });

  if (!response.ok) {
    return `Another happy customer at ${input.businessName}! Thanks for the kind words.`;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export async function generateReviewReply(input: {
  businessName: string;
  reviewText: string;
}): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = MODEL_CHAIN[0] || "openrouter/free";

  if (!apiKey) {
    return `Thank you for your feedback! We appreciate you choosing ${input.businessName}.`;
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": BRAND.name,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: `Write a short, friendly public reply from ${input.businessName} to this Google review:\n\n${input.reviewText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 120,
    }),
  });

  if (!response.ok) {
    return `Thank you for your feedback! We appreciate you choosing ${input.businessName}.`;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}
