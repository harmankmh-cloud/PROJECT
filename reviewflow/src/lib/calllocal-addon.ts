import type Stripe from "stripe";

/**
 * True when the given subscription is active/trialing AND contains a line item
 * for the CallLocal add-on price. Pure helper (no server-only deps) so it can be
 * unit tested and reused to keep `businesses.calllocal_subscribed` in sync.
 */
export function subscriptionHasActiveCallLocal(
  subscription: Pick<Stripe.Subscription, "status" | "items">,
  calllocalPriceId: string
): boolean {
  if (!calllocalPriceId) return false;
  const statusActive =
    subscription.status === "active" || subscription.status === "trialing";
  if (!statusActive) return false;
  return subscription.items.data.some((item) => item.price?.id === calllocalPriceId);
}
