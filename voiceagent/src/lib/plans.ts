/**
 * Pricing model: flat monthly base that INCLUDES a block of voice minutes,
 * then a per-minute overage above the included block.
 *
 * COST ASSUMPTION (conservative): the default voice stack
 * (Telnyx telephony + Deepgram STT + Telnyx TTS + Gemini Flash LLM) costs
 * roughly $0.04–0.06/min. We plan at $0.08/min to leave headroom for retries,
 * silence, and call overhead. Included-minute blocks are sized so the cost of
 * fully-used included minutes stays ≤ ~40% of the base price (≥ 60% gross
 * margin), and `perMinute` overage is ≥ ~2.25× the planned cost so no minute
 * is ever sold at a loss.
 *
 * NOTE: ElevenLabs voices (Twilio relay) cost ~$0.15–0.20/min. Keep the
 * default Telnyx voices as standard; treat ElevenLabs as a premium add-on so
 * its cost is not absorbed by the included-minute blocks.
 *
 * Configure the Stripe meter price to match `perMinute` with the first
 * `includedMinutes` units free (tiered/graduated pricing).
 */
export const PLANS = {
  starter: {
    name: "Starter",
    monthlyPrice: 79,
    includedMinutes: 300,
    perMinute: 0.25,
    maxAgents: 1,
    concurrentCalls: 5,
    features: ["1 agent", "300 minutes included", "Inbound calls", "Call logs", "Basic analytics", "Free sandbox explore"],
  },
  growth: {
    name: "Growth",
    monthlyPrice: 199,
    includedMinutes: 900,
    perMinute: 0.22,
    maxAgents: 2,
    concurrentCalls: 10,
    features: ["2 agents", "900 minutes included", "Flow builder", "Google Calendar", "Warm transfer", "SMS follow-up"],
  },
  pro: {
    name: "Pro",
    monthlyPrice: 399,
    includedMinutes: 2000,
    perMinute: 0.18,
    maxAgents: 5,
    concurrentCalls: 20,
    features: ["5 agents", "2,000 minutes included", "Flow builder", "HubSpot + Calendar", "Warm transfer", "Outbound campaigns"],
  },
  enterprise: {
    name: "Enterprise",
    monthlyPrice: 1500,
    includedMinutes: 8000,
    perMinute: 0.15,
    maxAgents: 999,
    concurrentCalls: 1000,
    features: [
      "Unlimited agents",
      "8,000+ minutes included",
      "SSO (SAML 2.0 & OIDC)",
      "Google Workspace & Microsoft Entra",
      "PIPEDA + provincial privacy controls",
      "US HIPAA & BAA (optional)",
      "Dedicated SLA & security review",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

/** Minutes above the plan's included block. */
export function overageMinutes(planKey: PlanKey, minutes: number): number {
  const plan = PLANS[planKey];
  return Math.max(0, minutes - plan.includedMinutes);
}

/** Estimated all-in monthly cost at a given minute volume (base + overage only). */
export function estimatedMonthly(planKey: PlanKey, minutes = 500): number {
  const plan = PLANS[planKey];
  const overage = overageMinutes(planKey, minutes);
  return Math.round((plan.monthlyPrice + overage * plan.perMinute) * 100) / 100;
}

export function planMaxAgents(planKey: PlanKey): number {
  return PLANS[planKey].maxAgents;
}

export function planConcurrentCalls(planKey: PlanKey): number {
  return PLANS[planKey].concurrentCalls;
}

/** Stack cost per minute used for margin checks (not customer-facing). */
export const PLANNED_COST_PER_MINUTE = 0.08;

/** Pick the cheapest plan that covers the given monthly minute volume (or Pro if above Pro included). */
export function recommendedPlanKey(minutes: number): PlanKey {
  const order: PlanKey[] = ["starter", "growth", "pro"];
  for (const key of order) {
    if (minutes <= PLANS[key].includedMinutes) return key;
  }
  return "pro";
}

/** Receptionist hire benchmark (CAD/mo) for ROI comparisons — part-time front desk. */
export const RECEPTIONIST_BENCHMARK_MONTHLY = 3500;

/** Competitor flat-rate reference (CAD/mo) for pricing comparisons — verify periodically. */
export const COMPETITOR_FLAT_RATE_MONTHLY = 199;

/** Days of grace after payment failure before blocking production calls. */
export const PAYMENT_GRACE_DAYS = 7;
