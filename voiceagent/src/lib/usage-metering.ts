import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PLANS, type PlanKey } from "@/lib/plans";
import { deductTrialMinutes, type TrialOrg } from "@/lib/trial";
import type { BillingOrg } from "@/lib/billing-gates";
import { orgSelectFields } from "@/lib/billing-schema";

export type UsageEventRow = {
  id: string;
  quantity: number;
  reported_to_stripe: boolean;
  created_at: string;
};

/** Start of current billing period (calendar month UTC fallback). */
export function currentBillingPeriodStart(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

/** Prefer Stripe-synced period start on the org row. */
export function billingPeriodStart(org?: Pick<BillingOrg, "billing_period_start"> | null): string {
  if (org?.billing_period_start) return org.billing_period_start;
  return currentBillingPeriodStart();
}

export function billingPeriodEnd(org?: Pick<BillingOrg, "billing_period_end"> | null): string | null {
  return org?.billing_period_end ?? null;
}

export function planIncludedMinutes(plan: string | null | undefined): number {
  if (plan && plan in PLANS) return PLANS[plan as PlanKey].includedMinutes;
  return 0;
}

export function summarizeUsage(
  events: UsageEventRow[],
  includedMinutes: number
): {
  totalMinutes: number;
  overageMinutes: number;
  includedUsed: number;
  percentUsed: number;
  estimatedOverageCents: number;
} {
  const totalMinutes = events.reduce((sum, e) => sum + Number(e.quantity), 0);
  const overageMinutes = Math.max(0, totalMinutes - includedMinutes);
  const includedUsed = Math.min(totalMinutes, includedMinutes);
  const percentUsed =
    includedMinutes > 0 ? Math.round((totalMinutes / includedMinutes) * 100) : 0;

  return {
    totalMinutes,
    overageMinutes,
    includedUsed,
    percentUsed,
    estimatedOverageCents: 0,
  };
}

export function summarizeUsageForPlan(
  events: UsageEventRow[],
  planKey: PlanKey
): ReturnType<typeof summarizeUsage> {
  const plan = PLANS[planKey];
  const summary = summarizeUsage(events, plan.includedMinutes);
  return {
    ...summary,
    estimatedOverageCents: Math.round(summary.overageMinutes * plan.perMinute * 100),
  };
}

/** Billable overage minutes from a chronological batch (only counts above included block). */
export function billableMinutesFromBatch(
  periodEvents: UsageEventRow[],
  includedMinutes: number,
  unreportedIds: Set<string>
): number {
  let running = 0;
  let billableUnreported = 0;

  for (const ev of periodEvents) {
    const qty = Number(ev.quantity);
    const before = running;
    running += qty;
    const overageBefore = Math.max(0, before - includedMinutes);
    const overageAfter = Math.max(0, running - includedMinutes);
    const increment = overageAfter - overageBefore;

    if (!ev.reported_to_stripe && unreportedIds.has(ev.id)) {
      billableUnreported += increment;
    }
  }

  return Math.ceil(billableUnreported);
}

export async function fetchPeriodUsageEvents(
  admin: SupabaseClient,
  orgId: string,
  periodStart = currentBillingPeriodStart()
): Promise<UsageEventRow[]> {
  const { data } = await admin
    .from("va_usage_events")
    .select("id, quantity, reported_to_stripe, created_at")
    .eq("org_id", orgId)
    .eq("event_type", "voice_minute")
    .gte("created_at", periodStart)
    .order("created_at", { ascending: true });

  return (data || []).map((row) => ({
    id: row.id,
    quantity: Number(row.quantity),
    reported_to_stripe: Boolean(row.reported_to_stripe),
    created_at: row.created_at,
  }));
}

/** Idempotent production usage record — skips sandbox and duplicate call_id rows. */
export async function recordCallUsage(
  admin: SupabaseClient,
  params: {
    orgId: string;
    callId: string;
    minutes: number;
    isSandbox: boolean;
  }
): Promise<{ recorded: boolean; reason?: string }> {
  const { orgId, callId, minutes, isSandbox } = params;

  if (isSandbox || minutes <= 0) {
    return { recorded: false, reason: "sandbox_or_zero" };
  }

  const { count } = await admin
    .from("va_usage_events")
    .select("id", { count: "exact", head: true })
    .eq("call_id", callId)
    .eq("event_type", "voice_minute");

  if (count && count > 0) {
    return { recorded: false, reason: "duplicate" };
  }

  await admin.from("va_usage_events").insert({
    org_id: orgId,
    call_id: callId,
    event_type: "voice_minute",
    quantity: minutes,
  });

  const { data: orgRow } = await admin
    .from("va_organizations")
    .select(
      await orgSelectFields("plan, stripe_subscription_id, trial_minutes_remaining")
    )
    .eq("id", orgId)
    .maybeSingle();

  if (orgRow) {
    await deductTrialMinutes(admin, orgId, orgRow as TrialOrg, minutes);
  }

  return { recorded: true };
}
