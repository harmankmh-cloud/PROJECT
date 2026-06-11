import { PLANS } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserOrg } from "@/lib/auth";
import { isStripeConfigured } from "@/lib/stripe";
import { SubscribeButton } from "@/components/SubscribeButton";
import { ManageSubscriptionButton } from "@/components/ManageSubscriptionButton";
import { BillingAutoSubscribe } from "@/components/BillingAutoSubscribe";
import type { PlanKey } from "@/lib/plans";
import {
  currentBillingPeriodStart,
  fetchPeriodUsageEvents,
  summarizeUsage,
} from "@/lib/usage-metering";
import {
  hasActiveSubscription,
  isTrialPlan,
  STRIPE_TRIAL_DAYS,
  trialMinutesRemaining,
  TRIAL_MINUTES_ON_SIGNUP,
} from "@/lib/trial";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string; subscribe?: string }>;
}) {
  const params = await searchParams;
  const subscribePlan =
    params.subscribe === "starter" ||
    params.subscribe === "growth" ||
    params.subscribe === "pro" ||
    params.subscribe === "enterprise"
      ? (params.subscribe as PlanKey)
      : null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const org = user ? await getUserOrg(user.id) : null;
  const stripeReady = isStripeConfigured();
  const periodStart = currentBillingPeriodStart();
  const plan = org?.plan || "trial";
  const onTrial = org ? isTrialPlan(org) : false;
  const subscribed = org ? hasActiveSubscription(org) : false;
  const planInfo =
    plan === "trial" || !(plan in PLANS)
      ? null
      : PLANS[plan as keyof typeof PLANS];
  const minutesLeft = org ? trialMinutesRemaining(org) : 0;

  let totalMinutes = 0;
  let overageMinutes = 0;
  let percentUsed = 0;

  if (org && subscribed && org.plan in PLANS) {
    const admin = createAdminClient();
    const events = await fetchPeriodUsageEvents(admin, org.id, periodStart);
    const summary = summarizeUsage(events, PLANS[org.plan as PlanKey].includedMinutes);
    totalMinutes = summary.totalMinutes;
    overageMinutes = summary.overageMinutes;
    percentUsed = summary.percentUsed;
  } else if (org) {
    const admin = createAdminClient();
    const events = await fetchPeriodUsageEvents(admin, org.id, periodStart);
    totalMinutes = events.reduce((s, e) => s + e.quantity, 0);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ghost-white">Billing</h1>
      <p className="mt-1 text-on-surface-variant">
        {onTrial
          ? `Explore free with ${TRIAL_MINUTES_ON_SIGNUP} trial minutes. Go live with a ${STRIPE_TRIAL_DAYS}-day Stripe trial — card required.`
          : "Usage-based voice minutes + subscription."}
      </p>

      {onTrial && (
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-50">
          <p className="font-medium text-ghost-white">Trial credits</p>
          <p className="mt-1">
            {minutesLeft} of {TRIAL_MINUTES_ON_SIGNUP} production minutes remaining. Sandbox text
            chat and up to 3 one-minute test calls stay free — no card required.
          </p>
        </div>
      )}

      {params.success && (
        <p className="mt-4 rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-800">
          Subscription updated. It may take a moment to reflect here.
        </p>
      )}
      {params.canceled && (
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Checkout canceled — no changes were made.
        </p>
      )}

      <BillingAutoSubscribe
        plan={subscribePlan}
        stripeReady={stripeReady}
        currentPlan={plan}
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="surface-card p-5">
          <p className="text-sm text-on-surface-variant">Current plan</p>
          <p className="text-2xl font-bold capitalize">
            {onTrial ? "Free explore" : planInfo?.name ?? plan}
          </p>
          {subscribed && (
            <p className="mt-1 text-xs text-teal-400">{STRIPE_TRIAL_DAYS}-day trial may apply on new subscriptions</p>
          )}
        </div>
        <div className="surface-card p-5">
          <p className="text-sm text-on-surface-variant">
            {onTrial ? "Trial minutes used" : "Minutes this period"}
          </p>
          <p className="text-2xl font-bold">
            {onTrial ? TRIAL_MINUTES_ON_SIGNUP - minutesLeft : totalMinutes}
            <span className="ml-1 text-sm font-normal text-on-surface-variant">
              {onTrial
                ? `/ ${TRIAL_MINUTES_ON_SIGNUP} trial`
                : planInfo
                  ? `/ ${planInfo.includedMinutes.toLocaleString()} incl.`
                  : ""}
            </span>
          </p>
          {subscribed && planInfo && !onTrial ? (
            <p className="mt-1 text-xs text-on-surface-variant">{percentUsed}% of included block</p>
          ) : null}
        </div>
        <div className="surface-card p-5">
          <p className="text-sm text-on-surface-variant">
            {onTrial ? "Trial minutes left" : "Est. overage this period"}
          </p>
          <p className="text-2xl font-bold">
            {onTrial
              ? minutesLeft
              : planInfo
                ? `$${(overageMinutes * planInfo.perMinute).toFixed(2)}`
                : "—"}
          </p>
          {subscribed && overageMinutes > 0 && planInfo ? (
            <p className="mt-1 text-xs text-rose-300">
              {overageMinutes.toLocaleString()} min × ${planInfo.perMinute}/min — calls still active
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-8 surface-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold">Stripe metered billing</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              {stripeReady
                ? "Voice overage minutes are reported to Stripe on invoice creation (included block is free)."
                : "Add STRIPE_SECRET_KEY and price IDs to enable billing."}
            </p>
            <p className="mt-4 text-xs text-slate-text">Webhook endpoint: /api/webhooks/stripe</p>
          </div>
          <ManageSubscriptionButton hasCustomer={Boolean(org?.stripe_customer_id)} />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(PLANS).map(([key, p]) => (
          <div key={key} className={`surface-card p-5 ${plan === key ? "ring-2 ring-teal-500" : ""}`}>
            <h3 className="font-bold">{p.name}</h3>
            <p className="mt-1 text-2xl font-bold">${p.monthlyPrice}/mo</p>
            <p className="text-sm text-on-surface-variant">
              {p.includedMinutes.toLocaleString()} min incl · then ${p.perMinute}/min
            </p>
            <ul className="mt-3 space-y-1 text-xs text-on-surface-variant">
              {p.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <SubscribeButton
              plan={key as PlanKey}
              currentPlan={plan}
              stripeReady={stripeReady}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
