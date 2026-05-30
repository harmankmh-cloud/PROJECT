type GenerateReviewInput = {
  businessName: string;
  businessType: string;
  tone: string;
  starRating: number;
  customerNotes: string;
  customInstruction: string;
};

const DEFAULT_MODEL = "google/gemini-2.0-flash-001";

function getModel() {
  return process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
}

export async function generateReviewOptions(input: GenerateReviewInput): Promise<string[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return [
      fallbackDraft(input, "warm"),
      fallbackDraft(input, "short"),
      fallbackDraft(input, "detailed"),
    ];
  }

  const systemPrompt = `You write honest Google reviews for local businesses. Tone: ${input.tone}.
Rules: never invent facts, never be rude, match the star rating honestly, sound like a real person.
Return ONLY a JSON array of exactly 3 different review strings. No markdown, no numbering.`;

  const userPrompt = `Business: ${input.businessName} (${input.businessType})
Star rating: ${input.starRating}/5
Customer notes: ${input.customerNotes}
Extra instruction: ${input.customInstruction}

Write 3 different Google review options (different wording, same honest meaning).`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "ReviewFlow",
      },
      body: JSON.stringify({
        model: getModel(),
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.85,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      return [fallbackDraft(input, "warm"), fallbackDraft(input, "short"), fallbackDraft(input, "detailed")];
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || "";
    const parsed = parseOptionsJson(raw);

    if (parsed.length >= 3) return parsed.slice(0, 3);
    if (parsed.length > 0) {
      while (parsed.length < 3) parsed.push(fallbackDraft(input, "warm"));
      return parsed.slice(0, 3);
    }
  } catch {
    /* use fallback below */
  }

  return [fallbackDraft(input, "warm"), fallbackDraft(input, "short"), fallbackDraft(input, "detailed")];
}

function parseOptionsJson(raw: string): string[] {
  try {
    const cleaned = raw.replace(/^```json?\s*|\s*```$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => typeof item === "string" && item.trim().length > 10);
    }
  } catch {
    const matches = raw.match(/"([^"]{20,})"/g);
    if (matches) return matches.map((m) => m.slice(1, -1));
  }
  return [];
}

function fallbackDraft(
  input: GenerateReviewInput,
  style: "warm" | "short" | "detailed"
): string {
  const notes = input.customerNotes.trim();
  const name = input.businessName;
  const stars = input.starRating;

  if (stars <= 2) {
    if (style === "short") return `Disappointed with ${name}. ${notes}`;
    if (style === "detailed")
      return `I had a below-average experience at ${name}. ${notes} Hoping they improve.`;
    return `My visit to ${name} didn't meet expectations. ${notes}`;
  }
  if (stars === 3) {
    if (style === "short") return `${name} was okay. ${notes}`;
    if (style === "detailed") return `Average experience at ${name}. ${notes} Room to improve.`;
    return `Decent visit to ${name}. ${notes}`;
  }
  if (style === "short") return `Good experience at ${name}. ${notes}`;
  if (style === "detailed")
    return `I enjoyed my visit to ${name}. ${notes} Would come back again.`;
  return `Great experience at ${name}! ${notes} Highly recommend.`;
}

/** @deprecated Use generateReviewOptions */
export async function generateReviewDraft(
  input: GenerateReviewInput & { experienceLevel: string }
): Promise<string> {
  const options = await generateReviewOptions({
    businessName: input.businessName,
    businessType: input.businessType,
    tone: input.tone,
    starRating: input.experienceLevel === "bad" ? 2 : input.experienceLevel === "okay" ? 3 : 5,
    customerNotes: input.customerNotes,
    customInstruction: input.customInstruction,
  });
  return options[0];
}

export async function generateSocialCaption(input: {
  businessName: string;
  reviewText: string;
}): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return `Another happy customer at ${input.businessName}! Thanks for the kind words.`;
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "ReviewFlow",
    },
    body: JSON.stringify({
      model: getModel(),
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

  if (!apiKey) {
    return `Thank you for your feedback! We appreciate you choosing ${input.businessName}.`;
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "ReviewFlow",
    },
    body: JSON.stringify({
      model: getModel(),
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
