import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserOrg } from "@/lib/auth";
import { PLANS, type PlanKey } from "@/lib/plans";
import {
  billingPeriodEnd,
  billingPeriodStart,
  fetchPeriodUsageEvents,
  summarizeUsageForPlan,
} from "@/lib/usage-metering";
import {
  concurrentCallsForOrg,
  countActiveProductionCalls,
  hasPaidAccess,
  isPaymentPastDue,
  maxAgentsForOrg,
  type BillingOrg,
} from "@/lib/billing-gates";
import { hasActiveSubscription, isTrialPlan, trialMinutesRemaining } from "@/lib/trial";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 404 });

  const billingOrg = org as BillingOrg;
  const admin = createAdminClient();
  const periodStart = billingPeriodStart(billingOrg);
  const periodEnd = billingPeriodEnd(billingOrg);
  const events = await fetchPeriodUsageEvents(admin, org.id, periodStart);

  const planKey = org.plan in PLANS ? (org.plan as PlanKey) : null;
  const usage = planKey
    ? summarizeUsageForPlan(events, planKey)
    : {
        totalMinutes: events.reduce((s, e) => s + e.quantity, 0),
        overageMinutes: 0,
        includedUsed: 0,
        percentUsed: 0,
        estimatedOverageCents: 0,
      };

  const { count: agentCount } = await admin
    .from("va_agents")
    .select("id", { count: "exact", head: true })
    .eq("org_id", org.id);

  const activeCalls = await countActiveProductionCalls(admin, org.id);

  return NextResponse.json({
    plan: org.plan,
    subscriptionStatus: org.subscription_status ?? null,
    subscribed: hasActiveSubscription(org),
    paidAccess: hasPaidAccess(billingOrg),
    paymentPastDue: isPaymentPastDue(billingOrg),
    onTrial: isTrialPlan(org),
    trialMinutesRemaining: trialMinutesRemaining(org),
    billingPeriod: {
      start: periodStart,
      end: periodEnd,
    },
    usage: {
      totalMinutes: usage.totalMinutes,
      includedMinutes: planKey ? PLANS[planKey].includedMinutes : 0,
      overageMinutes: usage.overageMinutes,
      percentUsed: usage.percentUsed,
      estimatedOverageCents: usage.estimatedOverageCents,
      perMinuteOverage: planKey ? PLANS[planKey].perMinute : null,
    },
    limits: {
      maxAgents: maxAgentsForOrg(billingOrg),
      currentAgents: agentCount ?? 0,
      concurrentCalls: concurrentCallsForOrg(billingOrg),
      activeCalls,
    },
    spendingLimitCents: org.spending_limit_cents ?? null,
    overageBlocked: Boolean(org.overage_blocked),
    accessUntil: org.access_until ?? null,
  });
}
