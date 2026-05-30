type GenerateReviewInput = {
  businessName: string;
  businessType: string;
  tone: string;
  experienceLevel: "great" | "good" | "okay" | "bad";
  customerNotes: string;
  customInstruction: string;
};

export async function generateReviewDraft(input: GenerateReviewInput): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "openrouter/free";

  if (!apiKey) {
    return fallbackDraft(input);
  }

  const isPrivate = input.experienceLevel === "bad";

  const systemPrompt = isPrivate
    ? `You help customers write calm private feedback to a local business. Never make the message more aggressive. Never create a public Google review. Keep it honest, short, and polite. Business tone: ${input.tone}.`
    : `You help customers write honest Google reviews for local businesses. Never invent facts. Never exaggerate. Keep reviews natural and human. Business tone: ${input.tone}.`;

  const userPrompt = `
Business: ${input.businessName}
Business type: ${input.businessType}
Experience level: ${input.experienceLevel}
Customer notes: ${input.customerNotes}
Custom instruction: ${input.customInstruction}

Write one ${isPrivate ? "private feedback message" : "Google review draft"} only.
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "ReviewFlow",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 220,
    }),
  });

  if (!response.ok) {
    return fallbackDraft(input);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  return content || fallbackDraft(input);
}

export async function generateSocialCaption(input: {
  businessName: string;
  reviewText: string;
}): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "openrouter/free";

  if (!apiKey) {
    return `Another happy customer at ${input.businessName}! Thanks for the kind words. Book with us today.`;
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
      model,
      messages: [
        {
          role: "user",
          content: `Turn this customer review into a short Instagram/Facebook caption for ${input.businessName}. Keep it natural. Add 3 hashtags.\n\nReview: ${input.reviewText}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 180,
    }),
  });

  if (!response.ok) {
    return `Another happy customer at ${input.businessName}! Thanks for the kind words. Book with us today.`;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export async function generateReviewReply(input: {
  businessName: string;
  reviewText: string;
}): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "openrouter/free";

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

function fallbackDraft(input: GenerateReviewInput): string {
  const notes = input.customerNotes.trim();
  if (input.experienceLevel === "bad") {
    return `I had a disappointing experience at ${input.businessName}. ${notes} I would appreciate if someone could follow up with me.`;
  }
  if (input.experienceLevel === "okay") {
    return `My experience at ${input.businessName} was okay overall. ${notes}`;
  }
  return `I had a good experience at ${input.businessName}. ${notes} I would recommend them.`;
}
