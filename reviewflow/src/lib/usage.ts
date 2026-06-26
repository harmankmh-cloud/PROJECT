import type { SupabaseClient } from "@supabase/supabase-js";
import { monthlyLimitForPlan, type PlanId } from "./plans";

export function startOfCurrentMonthIso(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

export function startOfCurrentWeekIso(): string {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - daysFromMonday);
  return monday.toISOString();
}

export async function countReviewsThisMonth(
  supabase: SupabaseClient,
  businessId: string
): Promise<number> {
  const { count } = await supabase
    .from("feedback_events")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId)
    .gte("created_at", startOfCurrentMonthIso());

  return count || 0;
}

export async function countReviewsThisWeek(
  supabase: SupabaseClient,
  businessId: string
): Promise<number> {
  const { count } = await supabase
    .from("feedback_events")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId)
    .gte("created_at", startOfCurrentWeekIso());

  return count || 0;
}

export async function getUsageSummary(
  supabase: SupabaseClient,
  businessId: string,
  plan: PlanId
) {
  const used = await countReviewsThisMonth(supabase, businessId);
  const limit = monthlyLimitForPlan(plan);
  const remaining = Math.max(limit - used, 0);
  const percent = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 100;

  return { used, limit, remaining, percent, atLimit: used >= limit };
}
