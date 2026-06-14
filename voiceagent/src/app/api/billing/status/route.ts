import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { getStripe, isStripeConfigured, stripePriceIds } from "@/lib/stripe";
import { resolveStripePriceIds } from "@/lib/stripe-prices";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  const stripe = getStripe();
  const configured = isStripeConfigured();
  const prices = configured ? await resolveStripePriceIds() : null;
  const meter = stripePriceIds();

  let webhookOk = Boolean(process.env.STRIPE_WEBHOOK_SECRET);
  if (stripe && !webhookOk) {
    try {
      const endpoints = await stripe.webhookEndpoints.list({ limit: 20 });
      webhookOk = endpoints.data.some((e) => e.url.includes("/api/webhooks/stripe"));
    } catch {
      webhookOk = false;
    }
  }

  return NextResponse.json({
    configured,
    webhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    webhookEndpoint: webhookOk,
    meterEventName: process.env.STRIPE_METER_EVENT_NAME || "voice_minutes",
    overagePrice: Boolean(meter.voiceMinutes?.startsWith("price_")),
    prices: prices
      ? {
          starter: Boolean(prices.starter?.startsWith("price_")),
          growth: Boolean(prices.growth?.startsWith("price_")),
          pro: Boolean(prices.pro?.startsWith("price_")),
          enterprise: Boolean(prices.enterprise?.startsWith("price_")),
        }
      : null,
    org: org
      ? {
          plan: org.plan,
          subscriptionStatus: org.subscription_status ?? null,
          stripeCustomerId: Boolean(org.stripe_customer_id),
          stripeSubscriptionId: Boolean(org.stripe_subscription_id),
          trialMinutesRemaining: org.trial_minutes_remaining ?? 0,
          sandboxTestCallsUsed: org.sandbox_test_calls_used ?? 0,
          billingPeriodEnd: org.billing_period_end ?? null,
          spendingLimitCents: org.spending_limit_cents ?? null,
          overageBlocked: Boolean(org.overage_blocked),
        }
      : null,
    ready:
      configured &&
      Boolean(
        prices?.starter &&
          prices?.growth &&
          prices?.pro &&
          prices?.enterprise &&
          meter.voiceMinutes?.startsWith("price_")
      ) &&
      webhookOk,
  });
}
