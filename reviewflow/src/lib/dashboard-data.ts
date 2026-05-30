import { createClient } from "@/lib/supabase/server";
import type { Business, DashboardStats, FeedbackEvent, PromptTemplate } from "@/lib/types";

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
    return { user: null, business: null, prompts: [], feedback: [], stats: null };
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!business) {
    return { user, business: null, prompts: [], feedback: [], stats: null };
  }

  const [promptsResult, feedbackResult, pageViews, googleClicks, publicDrafts, privateFeedback] =
    await Promise.all([
      supabase.from("prompt_templates").select("*").eq("business_id", business.id),
      supabase
        .from("feedback_events")
        .select("*")
        .eq("business_id", business.id)
        .order("created_at", { ascending: false })
        .limit(20),
      countEvents(business.id, "page_view"),
      countEvents(business.id, "google_click"),
      countEvents(business.id, "copy_review"),
      countEvents(business.id, "private_feedback"),
    ]);

  const stats: DashboardStats = {
    pageViews,
    googleClicks,
    privateFeedback,
    publicDrafts,
  };

  return {
    user,
    business: business as Business,
    prompts: (promptsResult.data || []) as PromptTemplate[],
    feedback: (feedbackResult.data || []) as FeedbackEvent[],
    stats,
  };
}
