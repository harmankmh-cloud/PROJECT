import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, reportVoiceMinutes } from "@/lib/stripe";
import { planFromResolvedPrices, resolveStripePriceIds } from "@/lib/stripe-prices";

async function updateOrgPlan(
  admin: ReturnType<typeof createAdminClient>,
  customerId: string,
  subscription: Stripe.Subscription
) {
  const priceId = subscription.items.data[0]?.price?.id;
  const metadataPlan = subscription.metadata?.plan;
  const prices = await resolveStripePriceIds();
  const plan =
    metadataPlan === "enterprise" || metadataPlan === "pro" || metadataPlan === "starter"
      ? metadataPlan
      : planFromResolvedPrices(priceId, prices);

  await admin
    .from("va_organizations")
    .update({
      stripe_subscription_id: subscription.id,
      plan,
    })
    .eq("stripe_customer_id", customerId);
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orgId = session.metadata?.org_id || session.client_reference_id;
    const customerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id;

    if (orgId && customerId) {
      await admin
        .from("va_organizations")
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id:
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription?.id || null,
          plan:
            session.metadata?.plan === "enterprise" ||
            session.metadata?.plan === "pro" ||
            session.metadata?.plan === "starter"
              ? session.metadata.plan
              : "starter",
        })
        .eq("id", orgId);
    }
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.created"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
    await updateOrgPlan(admin, customerId, subscription);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;

    await admin
      .from("va_organizations")
      .update({ plan: "starter", stripe_subscription_id: null })
      .eq("stripe_customer_id", customerId);
  }

  if (event.type === "invoice.created") {
    const { data: pending } = await admin
      .from("va_usage_events")
      .select("id, org_id, quantity, va_organizations(stripe_customer_id)")
      .eq("reported_to_stripe", false)
      .limit(100);

    const reportedIds: string[] = [];

    for (const usage of pending || []) {
      const org = usage.va_organizations as
        | { stripe_customer_id: string | null }
        | { stripe_customer_id: string | null }[]
        | null;
      const customerId = Array.isArray(org) ? org[0]?.stripe_customer_id : org?.stripe_customer_id;
      if (!customerId) continue;

      const result = await reportVoiceMinutes(customerId, Number(usage.quantity));
      if (result.ok) reportedIds.push(usage.id);
    }

    if (reportedIds.length) {
      await admin
        .from("va_usage_events")
        .update({ reported_to_stripe: true })
        .in("id", reportedIds);
    }
  }

  return NextResponse.json({ received: true });
}
