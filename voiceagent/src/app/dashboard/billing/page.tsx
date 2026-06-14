import { PLANS, type PlanKey } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserOrg } from "@/lib/auth";
import { isStripeConfigured } from "@/lib/stripe";
import { SubscribeButton } from "@/components/SubscribeButton";
import { ManageSubscriptionButton } from "@/components/ManageSubscriptionButton";
import { BillingAutoSubscribe } from "@/components/BillingAutoSubscribe";
import { SpendingLimitControl } from "@/components/billing/SpendingLimitControl";
import {
  billingPeriodStart,
  fetchPeriodUsageEvents,
  summarizeUsageForPlan,
} from "@/lib/usage-metering";
import {
  concurrentCallsForOrg,
  hasPaidAccess,
  isPaymentPastDue,
  maxAgentsForOrg,
  type BillingOrg,
} from "@/lib/billing-gates";
import {
  hasActiveSubscription,
  isTrialPlan,
  STRIPE_TRIAL_DAYS,
  trialMinutesRemaining,
  TRIAL_MINUTES_ON_SIGNUP,
} from "@/lib/trial";

function formatPeriodEnd(iso: string | null | undefined): string {
  if (!iso) return "calendar month (UTC)";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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
  const billingOrg = (org || {}) as BillingOrg;
  const stripeReady = isStripeConfigured();
  const periodStart = org ? billingPeriodStart(billingOrg) : "";
  const plan = org?.plan || "trial";
  const onTrial = org ? isTrialPlan(org) : false;
  const subscribed = org ? hasActiveSubscription(org) : false;
  const paidAccess = org ? hasPaidAccess(billingOrg) : false;
  const pastDue = org ? isPaymentPastDue(billingOrg) : false;
  const planInfo =
    plan === "trial" || !(plan in PLANS)
      ? null
      : PLANS[plan as keyof typeof PLANS];
  const minutesLeft = org ? trialMinutesRemaining(org) : 0;

  let totalMinutes = 0;
  let overageMinutes = 0;
  let percentUsed = 0;
  let agentCount = 0;

  if (org) {
    const admin = createAdminClient();
    const events = await fetchPeriodUsageEvents(admin, org.id, periodStart);
    if (subscribed && org.plan in PLANS) {
      const summary = summarizeUsageForPlan(events, org.plan as PlanKey);
      totalMinutes = summary.totalMinutes;
      overageMinutes = summary.overageMinutes;
      percentUsed = summary.percentUsed;
    } else {
      totalMinutes = events.reduce((s, e) => s + e.quantity, 0);
    }
    const { count } = await admin
      .from("va_agents")
      .select("id", { count: "exact", head: true })
      .eq("org_id", org.id);
    agentCount = count ?? 0;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ghost-white">Billing</h1>
      <p className="mt-1 text-on-surface-variant">
        {onTrial
          ? `Explore free with ${TRIAL_MINUTES_ON_SIGNUP} trial minutes. Go live with a ${STRIPE_TRIAL_DAYS}-day Stripe trial — card required.`
          : "Flat monthly plan with included minutes, then metered overage — industry-standard usage billing."}
      </p>

      {pastDue && (
        <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-50">
          <p className="font-medium text-ghost-white">Payment failed</p>
          <p className="mt-1">
            Update your payment method to avoid service interruption. You have a short grace period
            before production calls are paused.
          </p>
        </div>
      )}

      {org?.overage_blocked && (
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
          <p className="font-medium text-ghost-white">Overage spending cap reached</p>
          <p className="mt-1 text-amber-50">
            Production calls are paused until you raise your cap below or the billing period resets.
          </p>
        </div>
      )}

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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface-card p-5">
          <p className="text-sm text-on-surface-variant">Current plan</p>
          <p className="text-2xl font-bold capitalize">
            {onTrial ? "Free explore" : planInfo?.name ?? plan}
          </p>
          {subscribed && org?.subscription_status && (
            <p className="mt-1 text-xs capitalize text-on-surface-variant">
              Status: {org.subscription_status.replace("_", " ")}
              {!paidAccess && org.access_until
                ? ` · access until ${formatPeriodEnd(org.access_until)}`
                : ""}
            </p>
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
            <p className="mt-1 text-xs text-on-surface-variant">
              {percentUsed}% of included · resets {formatPeriodEnd(org?.billing_period_end)}
            </p>
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
              {overageMinutes.toLocaleString()} min × ${planInfo.perMinute}/min
            </p>
          ) : subscribed && planInfo ? (
            <p className="mt-1 text-xs text-on-surface-variant">
              Overage bills on next invoice — calls are not cut off at the included block
            </p>
          ) : null}
        </div>
        <div className="surface-card p-5">
          <p className="text-sm text-on-surface-variant">Plan limits</p>
          <p className="text-2xl font-bold">
            {agentCount}
            <span className="ml-1 text-sm font-normal text-on-surface-variant">
              / {maxAgentsForOrg(billingOrg)} agents
            </span>
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">
            {concurrentCallsForOrg(billingOrg)} concurrent calls max
          </p>
        </div>
      </div>

      <div className="mt-8 surface-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold">Stripe billing</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              {stripeReady
                ? "Base subscription + metered voice overage. Only minutes above your included block are reported to Stripe."
                : "Add STRIPE_SECRET_KEY and price IDs to enable billing."}
            </p>
            <p className="mt-4 text-xs text-slate-text">Webhook: /api/webhooks/stripe · Usage API: /api/billing/usage</p>
          </div>
          <ManageSubscriptionButton hasCustomer={Boolean(org?.stripe_customer_id)} />
        </div>

        <SpendingLimitControl
          subscribed={subscribed}
          initialLimitCents={org?.spending_limit_cents ?? null}
          overageBlocked={Boolean(org?.overage_blocked)}
        />
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
