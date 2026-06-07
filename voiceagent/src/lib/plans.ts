/**
 * Pricing model: flat monthly base that INCLUDES a block of voice minutes,
 * then a per-minute overage above the included block.
 *
 * `perMinute` is the overage rate. It is intentionally set to ~2–3× our true
 * cost-per-minute (telephony + STT + TTS + LLM ≈ $0.08/min) so no minute is
 * ever sold at a loss. Configure the Stripe meter price to match `perMinute`
 * with the first `includedMinutes` units free (tiered/graduated pricing).
 */
export const PLANS = {
  starter: {
    name: "Starter",
    monthlyPrice: 79,
    includedMinutes: 300,
    perMinute: 0.25,
    concurrentCalls: 5,
    features: ["1 agent", "300 minutes included", "Inbound calls", "Call logs", "Basic analytics", "Sandbox testing"],
  },
  growth: {
    name: "Growth",
    monthlyPrice: 199,
    includedMinutes: 1000,
    perMinute: 0.2,
    concurrentCalls: 10,
    features: ["2 agents", "1,000 minutes included", "Flow builder", "Google Calendar", "Warm transfer", "SMS follow-up"],
  },
  pro: {
    name: "Pro",
    monthlyPrice: 399,
    includedMinutes: 2500,
    perMinute: 0.15,
    concurrentCalls: 20,
    features: ["5 agents", "2,500 minutes included", "Flow builder", "HubSpot + Calendar", "Warm transfer", "Outbound campaigns"],
  },
  enterprise: {
    name: "Enterprise",
    monthlyPrice: 1500,
    includedMinutes: 10000,
    perMinute: 0.12,
    concurrentCalls: 1000,
    features: [
      "Unlimited agents",
      "10,000+ minutes included",
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
