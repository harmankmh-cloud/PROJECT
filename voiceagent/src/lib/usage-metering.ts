import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PLANS, type PlanKey } from "@/lib/plans";

export type UsageEventRow = {
  id: string;
  quantity: number;
  reported_to_stripe: boolean;
  created_at: string;
};

/** Start of current billing period (calendar month UTC until Stripe period is wired). */
export function currentBillingPeriodStart(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
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
} {
  const totalMinutes = events.reduce((sum, e) => sum + Number(e.quantity), 0);
  const overageMinutes = Math.max(0, totalMinutes - includedMinutes);
  const includedUsed = Math.min(totalMinutes, includedMinutes);
  const percentUsed =
    includedMinutes > 0 ? Math.round((totalMinutes / includedMinutes) * 100) : 0;

  return { totalMinutes, overageMinutes, includedUsed, percentUsed };
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
