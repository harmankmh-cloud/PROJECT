/** Honest feature comparison for pricing page — update when competitors change. */
export const PRICING_COMPETITOR_MATRIX = {
  competitors: ["GreetQ", "NextPhone", "Smith.ai"] as const,
  rows: [
    { feature: "24/7 AI answering", greetq: true, nextPhone: true, smithAi: true },
    { feature: "Books appointments", greetq: true, nextPhone: true, smithAi: true },
    { feature: "Call transcripts", greetq: true, nextPhone: true, smithAi: true },
    { feature: "Native HubSpot logging", greetq: true, nextPhone: false, smithAi: true },
    { feature: "Google Calendar booking", greetq: true, nextPhone: true, smithAi: true },
    { feature: "Canadian support & PIPEDA focus", greetq: true, nextPhone: false, smithAi: false },
    { feature: "French voice agent", greetq: "roadmap", nextPhone: false, smithAi: false },
    { feature: "Starting price (CAD/mo)", greetq: "$79", nextPhone: "$199", smithAi: "$95" },
  ] as const,
} as const;

export type MatrixCell = boolean | string;

export function matrixCellLabel(value: MatrixCell): string {
  if (value === true) return "✓";
  if (value === false) return "—";
  if (value === "roadmap") return "Roadmap";
  return value;
}
