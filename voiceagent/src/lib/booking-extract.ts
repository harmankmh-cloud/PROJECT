import "server-only";
import { chatCompletion, hasOpenRouter } from "./openrouter";

export type BookingDetails = {
  ready: boolean;
  customerName?: string;
  date?: string;
  time?: string;
  notes?: string;
  missing?: string[];
  reply?: string;
};

export async function extractBookingDetails(params: {
  history: Array<{ role: string; content: string }>;
  userMessage: string;
  callerPhone?: string;
}): Promise<BookingDetails> {
  if (!hasOpenRouter()) {
    return {
      ready: false,
      missing: ["date", "time"],
      reply: "What day and time work for your appointment?",
    };
  }

  const transcript = [
    ...params.history.slice(-6),
    { role: "user", content: params.userMessage },
  ]
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const raw = await chatCompletion({
    jsonMode: true,
    max_tokens: 200,
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content:
          'Extract appointment booking from a phone call. Return JSON only: {"ready":boolean,"customerName":string|null,"date":"YYYY-MM-DD"|null,"time":"HH:MM"|null,"notes":string|null,"missing":string[],"reply":string|null}. Use America/New_York for relative dates like "tomorrow". If missing info, set ready false, list missing fields, and reply with one short question.',
      },
      { role: "user", content: transcript },
    ],
  });

  if (!raw) {
    return { ready: false, missing: ["date", "time"], reply: "What day and time would you like?" };
  }

  try {
    const parsed = JSON.parse(raw) as BookingDetails;
    if (!parsed.customerName && params.callerPhone) {
      parsed.customerName = "Caller";
    }
    return parsed;
  } catch {
    return { ready: false, missing: ["date", "time"], reply: "What day and time work for you?" };
  }
}
