import { createClient } from "@/lib/supabase/server";
import type {
  Business,
  DashboardStats,
  FeedbackEvent,
  PromptTemplate,
  UsageSummary,
} from "@/lib/types";
import { resolvePlan } from "@/lib/business-plan";
import { FEEDBACK_PAGE_SIZE } from "@/lib/constants";
import { monthlyLimitForPlan, PLAN_LIMITS } from "@/lib/plans";
import { countReviewsThisMonth } from "@/lib/usage";

async function countEvents(businessId: string, eventType: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("analytics_events")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId)
    .eq("event_type", eventType);

  return count || 0;
}

export async function getDashboardData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      business: null,
      prompts: [],
      feedback: [],
      feedbackTotal: 0,
      stats: null,
      usage: null,
    };
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!business) {
    return {
      user,
      business: null,
      prompts: [],
      feedback: [],
      feedbackTotal: 0,
      stats: null,
      usage: null,
    };
  }

  const plan = resolvePlan(business as Business);

  const [
    promptsResult,
    feedbackResult,
    feedbackCountResult,
    pageViews,
    googleClicks,
    publicDrafts,
    ownerNotifications,
    reviewsThisMonth,
  ] = await Promise.all([
    supabase.from("prompt_templates").select("*").eq("business_id", business.id),
    supabase
      .from("feedback_events")
      .select("*")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false })
      .range(0, FEEDBACK_PAGE_SIZE - 1),
    supabase
      .from("feedback_events")
      .select("*", { count: "exact", head: true })
      .eq("business_id", business.id),
    countEvents(business.id, "page_view"),
    countEvents(business.id, "google_click"),
    countEvents(business.id, "copy_review"),
    countEvents(business.id, "owner_notification"),
    countReviewsThisMonth(supabase, business.id),
  ]);

  const legacyPrivate = await countEvents(business.id, "private_feedback");

  const stats: DashboardStats = {
    pageViews,
    googleClicks,
    ownerNotifications: ownerNotifications + legacyPrivate,
    publicDrafts,
  };

  const limit = monthlyLimitForPlan(plan);
  const usage: UsageSummary = {
    used: reviewsThisMonth,
    limit,
    remaining: Math.max(limit - reviewsThisMonth, 0),
    percent: limit > 0 ? Math.min(Math.round((reviewsThisMonth / limit) * 100), 100) : 100,
    atLimit: reviewsThisMonth >= limit,
    plan,
    planLabel: PLAN_LIMITS[plan].label,
  };

  return {
    user,
    business: business as Business,
    prompts: (promptsResult.data || []) as PromptTemplate[],
    feedback: (feedbackResult.data || []) as FeedbackEvent[],
    feedbackTotal: feedbackCountResult.count || 0,
    stats,
    usage,
  };
}
