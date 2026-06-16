import { createClient } from "@/lib/supabase/server";

export type AnalyticsSnapshot = {
  pageViews: number;
  googleClicks: number;
  copyReviews: number;
  ownerNotifications: number;
  pageViewsTrend: { date: string; count: number }[];
  googleClicksTrend: { date: string; count: number }[];
  conversionRate: number;
  reviewsThisMonth: number;
};

function dayKey(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

function countByDay(rows: { created_at: string }[]) {
  const map = new Map<string, number>();
  for (const row of rows) {
    const key = dayKey(row.created_at);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()].map(([date, count]) => ({ date, count }));
}

export async function getAnalyticsSnapshot(businessId: string): Promise<AnalyticsSnapshot> {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceIso = since.toISOString();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [eventsResult, reviewsMonthResult] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("event_type, created_at")
      .eq("business_id", businessId)
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: true }),
    supabase
      .from("feedback_events")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId)
      .gte("created_at", monthStart.toISOString()),
  ]);

  const events = eventsResult.data ?? [];
  const pageViews = events.filter((e) => e.event_type === "page_view");
  const googleClicks = events.filter((e) => e.event_type === "google_click");
  const copyReviews = events.filter((e) => e.event_type === "copy_review").length;
  const ownerNotifications =
    events.filter((e) => e.event_type === "owner_notification" || e.event_type === "private_feedback")
      .length;

  const totalPageViews = pageViews.length;
  const totalGoogleClicks = googleClicks.length;

  return {
    pageViews: totalPageViews,
    googleClicks: totalGoogleClicks,
    copyReviews,
    ownerNotifications,
    pageViewsTrend: countByDay(pageViews),
    googleClicksTrend: countByDay(googleClicks),
    conversionRate:
      totalPageViews > 0 ? Math.round((totalGoogleClicks / totalPageViews) * 100) : 0,
    reviewsThisMonth: reviewsMonthResult.count ?? 0,
  };
}
