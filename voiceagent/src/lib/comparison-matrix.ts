import { PLANS } from "@/lib/plans";

export type ComparisonMatrixRow = {
  feature: string;
  greetq: string;
  retell: string;
  bland: string;
  justcall: string;
};

/** Server-rendered feature matrix for /compare hub (SEO + conversion). */
export const COMPARISON_MATRIX: ComparisonMatrixRow[] = [
  {
    feature: "Pricing model",
    greetq: "Flat monthly from $79 CAD",
    retell: "Usage-based + credits",
    bland: "Per-minute API scale",
    justcall: "Phone system + AI add-ons",
  },
  {
    feature: "Included minutes",
    greetq: `${PLANS.starter.includedMinutes}–${PLANS.pro.includedMinutes.toLocaleString()} / mo`,
    retell: "Credit grants on signup",
    bland: "Pay per minute",
    justcall: "Varies by plan tier",
  },
  {
    feature: "PIPEDA / CASL tooling",
    greetq: "Built in",
    retell: "Self-configured",
    bland: "Self-configured",
    justcall: "Self-configured",
  },
  {
    feature: "Warm transfer + transcript",
    greetq: "Included (Growth+)",
    retell: "Available",
    bland: "Available",
    justcall: "Varies by tier",
  },
  {
    feature: "No-card sandbox explore",
    greetq: "30 free minutes + text sandbox",
    retell: "Card for production numbers",
    bland: "Developer-first signup",
    justcall: "Trial varies",
  },
  {
    feature: "Canadian support focus",
    greetq: "BC-first, PIPEDA-aware",
    retell: "Global",
    bland: "US-focused",
    justcall: "Global",
  },
];
