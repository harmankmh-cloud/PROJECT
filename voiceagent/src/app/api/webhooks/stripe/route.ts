import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, reportVoiceMinutes } from "@/lib/stripe";
import { planFromResolvedPrices, resolveStripePriceIds } from "@/lib/stripe-prices";
import { graceAccessUntil } from "@/lib/billing-gates";
import {
  isBillingMigrationApplied,
  orgSelectFields,
  orgUpdateFields,
} from "@/lib/billing-schema";
import {
  billableMinutesFromBatch,
  billingPeriodStart,
  planIncludedMinutes,
} from "@/lib/usage-metering";

function subscriptionPeriod(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  return {
    start: item?.current_period_start
      ? new Date(item.current_period_start * 1000).toISOString()
      : null,
    end: item?.current_period_end
      ? new Date(item.current_period_end * 1000).toISOString()
      : null,
  };
}

async function updateOrgFromSubscription(
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

  const period = subscriptionPeriod(subscription);
  const status = subscription.status;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;
  const accessUntil =
    cancelAtPeriodEnd && period.end
      ? period.end
      : status === "past_due"
        ? graceAccessUntil()
        : null;

  await admin
    .from("va_organizations")
    .update(
      await orgUpdateFields({
        stripe_subscription_id: subscription.id,
        plan,
        subscription_status: status,
        billing_period_start: period.start,
        billing_period_end: period.end,
        access_until: accessUntil,
      })
    )
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
    const subId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (orgId && customerId) {
      const updates: Record<string, unknown> = {
        stripe_customer_id: customerId,
        stripe_subscription_id: subId || null,
        plan:
          session.metadata?.plan === "enterprise" ||
          session.metadata?.plan === "pro" ||
          session.metadata?.plan === "growth" ||
          session.metadata?.plan === "starter"
            ? session.metadata.plan
            : "starter",
        subscription_status: subId ? "trialing" : null,
      };

      if (subId) {
        try {
          const sub = await stripe.subscriptions.retrieve(subId);
          const period = subscriptionPeriod(sub);
          updates.subscription_status = sub.status;
          updates.billing_period_start = period.start;
          updates.billing_period_end = period.end;
        } catch {
          // non-fatal — subscription.updated will sync
        }
      }

      await admin
        .from("va_organizations")
        .update(await orgUpdateFields(updates))
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
    await updateOrgFromSubscription(admin, customerId, subscription);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;

    const period = subscriptionPeriod(subscription);
    const endedAt = period.end || new Date().toISOString();

    await admin
      .from("va_organizations")
      .update(
        await orgUpdateFields({
          plan: "trial",
          stripe_subscription_id: null,
          subscription_status: "canceled",
          access_until: endedAt,
          billing_period_start: null,
          billing_period_end: null,
          trial_minutes_remaining: 0,
        })
      )
      .eq("stripe_customer_id", customerId);
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId =
      typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;

    if (customerId) {
      await admin
        .from("va_organizations")
        .update(
          await orgUpdateFields({
            subscription_status: "past_due",
            access_until: graceAccessUntil(),
          })
        )
        .eq("stripe_customer_id", customerId);
    }
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId =
      typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;

    if (customerId && (await isBillingMigrationApplied())) {
      await admin
        .from("va_organizations")
        .update({
          subscription_status: "active",
          access_until: null,
          overage_blocked: false,
        })
        .eq("stripe_customer_id", customerId)
        .in("subscription_status", ["past_due", "unpaid"]);
    }
  }

  if (event.type === "invoice.created") {
    const { data: orgRows } = await admin
      .from("va_organizations")
      .select(
        await orgSelectFields("id, stripe_customer_id, stripe_subscription_id, plan")
      )
      .not("stripe_subscription_id", "is", null);

    const orgs = (orgRows || []) as unknown as Array<{
      id: string;
      stripe_customer_id: string | null;
      stripe_subscription_id: string | null;
      plan: string | null;
      billing_period_start?: string | null;
    }>;

    const reportedIds: string[] = [];

    for (const org of orgs || []) {
      if (!org.stripe_customer_id || !org.stripe_subscription_id) continue;

      const periodStart = billingPeriodStart(org);

      const { data: pending } = await admin
        .from("va_usage_events")
        .select("id, quantity, created_at")
        .eq("org_id", org.id)
        .eq("reported_to_stripe", false)
        .eq("event_type", "voice_minute")
        .gte("created_at", periodStart)
        .limit(500);

      if (!pending?.length) continue;

      const unreportedIds = new Set(pending.map((u) => u.id));
      const included = planIncludedMinutes(org.plan);

      const { data: periodEvents } = await admin
        .from("va_usage_events")
        .select("id, quantity, reported_to_stripe, created_at")
        .eq("org_id", org.id)
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
        const result = await reportVoiceMinutes(org.stripe_customer_id, billable);
        if (!result.ok) continue;
      }

      reportedIds.push(...pending.map((u) => u.id));
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
