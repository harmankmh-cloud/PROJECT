import "server-only";

import type Stripe from "stripe";
import type { Business } from "@/lib/types";
import {
  syncBusinessFromCheckoutSession,
  updateBusinessFromSubscription,
} from "@/lib/stripe-subscription";

export type ActivatePlanResult = { ok: boolean; error?: string; plan?: string };

export async function activateBusinessPlan(
  stripe: Stripe,
  business: Pick<Business, "id" | "stripe_customer_id">,
  userEmail: string | undefined,
  sessionId?: string
): Promise<ActivatePlanResult> {
  if (sessionId) {
    return syncBusinessFromCheckoutSession(stripe, business.id, sessionId);
  }

  if (business.stripe_customer_id) {
    const subscriptions = await stripe.subscriptions.list({
      customer: business.stripe_customer_id,
      status: "all",
      limit: 1,
    });
    const subscription = subscriptions.data[0];
    if (!subscription) {
      return {
        ok: false,
        error: "No Stripe subscription found yet. Wait a moment and try again.",
      };
    }
    return updateBusinessFromSubscription(
      business.id,
      subscription,
      business.stripe_customer_id
    );
  }

  if (!userEmail) {
    return { ok: false, error: "Could not find your Stripe checkout." };
  }

  const customers = await stripe.customers.list({ email: userEmail, limit: 5 });
  const customer = customers.data.find((row) => row.email === userEmail) ?? customers.data[0];

  if (!customer) {
    return {
      ok: false,
      error:
        "No Stripe customer found for your email. If you just paid, wait 30 seconds and try again.",
    };
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    status: "all",
    limit: 1,
  });
  const subscription = subscriptions.data[0];

  if (!subscription) {
    return {
      ok: false,
      error: "No Stripe subscription found yet. Wait a moment and try again.",
    };
  }

  return updateBusinessFromSubscription(business.id, subscription, customer.id);
}
