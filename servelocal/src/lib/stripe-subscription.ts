import type Stripe from "stripe";
import { updateProviderAdmin } from "@/lib/data";
import type { ListingTier } from "@/lib/types";

function tierFromPlan(plan?: string | null): ListingTier {
  if (plan === "premium") return "premium";
  if (plan === "featured") return "featured";
  return "free";
}

function isActiveSubscription(status: Stripe.Subscription.Status) {
  return status === "active" || status === "trialing";
}

export async function updateProviderFromSubscription(
  providerId: string,
  subscription: Stripe.Subscription,
  planFromMetadata?: string | null
) {
  const plan = planFromMetadata || subscription.metadata?.plan;
  const active = isActiveSubscription(subscription.status);
  const tier = active ? tierFromPlan(plan) : "free";

  return updateProviderAdmin(providerId, {
    listing_tier: tier,
    featured: tier !== "free",
  });
}
