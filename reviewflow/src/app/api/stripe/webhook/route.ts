import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

async function updateBusinessFromSubscription(
  businessId: string,
  subscription: Stripe.Subscription,
  customerId: string
) {
  const admin = createServiceClient();
  if (!admin) return;

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

  await admin.from("businesses").update(payload).eq("id", businessId);
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const businessId = session.metadata?.business_id || session.client_reference_id;

      if (businessId && session.customer && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(String(session.subscription));
        await updateBusinessFromSubscription(
          businessId,
          subscription,
          String(session.customer)
        );
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const businessId = subscription.metadata?.business_id;
      const customerId = String(subscription.customer);

      if (businessId) {
        await updateBusinessFromSubscription(businessId, subscription, customerId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
