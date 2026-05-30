import "server-only";

import type Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/admin";

export async function updateBusinessFromSubscription(
  businessId: string,
  subscription: Stripe.Subscription,
  customerId: string
): Promise<{ ok: boolean; error?: string; plan?: string }> {
  const admin = createServiceClient();
  if (!admin) {
    return { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY missing in .env.local" };
  }

  const status = subscription.status;
  let plan: "active" | "past_due" | "canceled" | "trial" = "trial";

  if (status === "active" || status === "trialing") plan = "active";
  else if (status === "past_due" || status === "unpaid") plan = "past_due";
  else if (status === "canceled" || status === "incomplete_expired") plan = "canceled";

  const payload: Record<string, unknown> = {
    plan,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    subscription_status: status,
    updated_at: new Date().toISOString(),
  };

  if (plan === "active") {
    const { data: existing } = await admin
      .from("businesses")
      .select("setup_paid_at")
      .eq("id", businessId)
      .maybeSingle();

    if (!existing?.setup_paid_at) {
      payload.setup_paid_at = new Date().toISOString();
    }
  }

  const { error } = await admin.from("businesses").update(payload).eq("id", businessId);

  if (error) {
    const hint = error.message.includes("plan")
      ? " Run supabase/migration-billing.sql in the Supabase SQL Editor, then try again."
      : "";
    return { ok: false, error: `${error.message}.${hint}` };
  }

  return { ok: true, plan };
}

export async function syncBusinessFromCheckoutSession(
  stripe: Stripe,
  businessId: string,
  sessionId: string
): Promise<{ ok: boolean; error?: string; plan?: string }> {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid" && session.status !== "complete") {
    return { ok: false, error: "Checkout is not complete yet. Wait a moment and try again." };
  }

  const sessionBusinessId = session.metadata?.business_id || session.client_reference_id;
  if (sessionBusinessId !== businessId) {
    return { ok: false, error: "This payment does not belong to your business." };
  }

  if (!session.customer || !session.subscription) {
    return { ok: false, error: "Checkout session missing customer or subscription." };
  }

  const subscription = await stripe.subscriptions.retrieve(String(session.subscription));
  return updateBusinessFromSubscription(businessId, subscription, String(session.customer));
}
