export const PLANS = {
  starter: {
    name: "Starter",
    monthlyPrice: 99,
    perMinute: 0.12,
    concurrentCalls: 5,
    features: ["1 agent", "Inbound calls", "Call logs", "Basic analytics", "Sandbox testing"],
  },
  growth: {
    name: "Growth",
    monthlyPrice: 249,
    perMinute: 0.1,
    concurrentCalls: 10,
    features: ["2 agents", "Flow builder", "Google Calendar", "Warm transfer", "SMS follow-up"],
  },
  pro: {
    name: "Pro",
    monthlyPrice: 499,
    perMinute: 0.09,
    concurrentCalls: 20,
    features: ["5 agents", "Flow builder", "HubSpot + Calendar", "Warm transfer", "Outbound campaigns"],
  },
  enterprise: {
    name: "Enterprise",
    monthlyPrice: 2000,
    perMinute: 0.06,
    concurrentCalls: 1000,
    features: [
      "Unlimited agents",
      "SSO (SAML 2.0 & OIDC)",
      "Google Workspace & Microsoft Entra",
      "PIPEDA + provincial privacy controls",
      "US HIPAA & BAA (optional)",
      "Dedicated SLA & security review",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

/** Estimated all-in monthly cost at a given minute volume. */
export function estimatedMonthly(planKey: PlanKey, minutes = 500): number {
  const plan = PLANS[planKey];
  return Math.round((plan.monthlyPrice + minutes * plan.perMinute) * 100) / 100;
}
