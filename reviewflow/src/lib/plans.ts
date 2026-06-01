import { BRAND } from "@/lib/brand";

export type PlanId = "trial" | "active" | "past_due" | "canceled";

export const PLAN_LIMITS: Record<PlanId, { label: string; monthlyReviews: number }> = {
  trial: { label: "Free trial", monthlyReviews: 50 },
  active: { label: BRAND.proPlan, monthlyReviews: 500 },
  past_due: { label: "Payment issue", monthlyReviews: 50 },
  canceled: { label: "Canceled", monthlyReviews: 0 },
};

export const PRICING = {
  setupUsd: 99,
  monthlyUsd: 39,
  setupCents: 9900,
  monthlyCents: 3900,
};

export function planFromSubscriptionStatus(
  status: string | null | undefined,
  hasPaidSetup: boolean
): PlanId {
  if (!hasPaidSetup && status !== "active" && status !== "trialing") return "trial";
  if (status === "active" || status === "trialing") return "active";
  if (status === "past_due" || status === "unpaid") return "past_due";
  if (status === "canceled" || status === "incomplete_expired") return "canceled";
  return hasPaidSetup ? "active" : "trial";
}

export function monthlyLimitForPlan(plan: PlanId): number {
  return PLAN_LIMITS[plan]?.monthlyReviews ?? PLAN_LIMITS.trial.monthlyReviews;
}

export function pricingLabel() {
  return `$${PRICING.setupUsd} setup + $${PRICING.monthlyUsd}/mo`;
}
