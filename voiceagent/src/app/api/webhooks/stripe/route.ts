import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, reportVoiceMinutes } from "@/lib/stripe";
import { planFromResolvedPrices, resolveStripePriceIds } from "@/lib/stripe-prices";
import {
  billableMinutesFromBatch,
  currentBillingPeriodStart,
  planIncludedMinutes,
} from "@/lib/usage-metering";

async function updateOrgPlan(
  admin: ReturnType<typeof createAdminClient>,
  customerId: string,
  subscription: Stripe.Subscription
) {
  const priceId = subscription.items.data[0]?.price?.id;
  const metadataPlan = subscription.metadata?.plan;
  const prices = await resolveStripePriceIds();
  const plan =
    metadataPlan === "enterprise" ||
    metadataPlan === "pro" ||
    metadataPlan === "growth" ||
    metadataPlan === "starter"
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
            session.metadata?.plan === "growth" ||
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
      .update({
        plan: "trial",
        stripe_subscription_id: null,
        trial_minutes_remaining: 0,
      })
      .eq("stripe_customer_id", customerId);
  }

  if (event.type === "invoice.created") {
    const periodStart = currentBillingPeriodStart();
    const { data: pending } = await admin
      .from("va_usage_events")
      .select(
        "id, org_id, quantity, created_at, va_organizations(stripe_customer_id, stripe_subscription_id, plan)"
      )
      .eq("reported_to_stripe", false)
      .eq("event_type", "voice_minute")
      .limit(500);

    const reportedIds: string[] = [];
    const byOrg = new Map<string, typeof pending>();

    for (const usage of pending || []) {
      const list = byOrg.get(usage.org_id) || [];
      list.push(usage);
      byOrg.set(usage.org_id, list);
    }

    for (const [orgId, orgPending] of byOrg) {
      if (!orgPending?.length) continue;
      const orgRaw = orgPending[0]?.va_organizations;
      const org = Array.isArray(orgRaw) ? orgRaw[0] : orgRaw;
      const customerId = org?.stripe_customer_id;
      const unreportedIds = new Set(orgPending.map((u) => u.id));

      if (org?.stripe_subscription_id && customerId) {
        const included = planIncludedMinutes(org.plan);
        const { data: periodEvents } = await admin
          .from("va_usage_events")
          .select("id, quantity, reported_to_stripe, created_at")
          .eq("org_id", orgId)
          .eq("event_type", "voice_minute")
          .gte("created_at", periodStart)
          .order("created_at", { ascending: true });

        const billable = billableMinutesFromBatch(
          (periodEvents || []).map((row) => ({
            id: row.id,
            quantity: Number(row.quantity),
            reported_to_stripe: Boolean(row.reported_to_stripe),
            created_at: row.created_at,
          })),
          included,
          unreportedIds
        );

        if (billable > 0) {
          const result = await reportVoiceMinutes(customerId, billable);
          if (!result.ok) continue;
        }
      }

      reportedIds.push(...orgPending.map((u) => u.id));
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
