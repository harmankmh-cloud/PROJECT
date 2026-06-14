import type { Business, PlanId } from "./types";

export function resolvePlan(business: Business): PlanId {
  const plan = business.plan as PlanId | undefined;
  if (plan === "active" || plan === "past_due" || plan === "canceled") return plan;
  if (business.setup_paid_at && business.subscription_status === "active") return "active";
  if (business.subscription_status === "past_due") return "past_due";
  if (business.subscription_status === "canceled") return "canceled";
  return "trial";
}
