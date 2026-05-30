import { createServiceClient } from "@/lib/supabase/admin";
import { resolvePlan } from "@/lib/business-plan";
import { countReviewsThisMonth } from "@/lib/usage";
import type { Business } from "@/lib/types";

export type AdminBusinessRow = {
  id: string;
  name: string;
  slug: string;
  business_type: string;
  plan: string;
  subscription_status: string | null;
  created_at: string;
  reviewCount: number;
  reviewsThisMonth: number;
  pageViews: number;
};

export async function getPlatformAdminData(): Promise<AdminBusinessRow[]> {
  const admin = createServiceClient();
  if (!admin) return [];

  const { data: businesses } = await admin
    .from("businesses")
    .select("*")
    .order("created_at", { ascending: false });

  if (!businesses?.length) return [];

  const rows: AdminBusinessRow[] = [];

  for (const business of businesses) {
    const b = business as Business;
    const plan = resolvePlan(b);

    const [reviewCount, reviewsThisMonth, pageViews] = await Promise.all([
      admin
        .from("feedback_events")
        .select("*", { count: "exact", head: true })
        .eq("business_id", b.id)
        .then((r) => r.count || 0),
      countReviewsThisMonth(admin, b.id),
      admin
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("business_id", b.id)
        .eq("event_type", "page_view")
        .then((r) => r.count || 0),
    ]);

    rows.push({
      id: b.id,
      name: b.name,
      slug: b.slug,
      business_type: b.business_type,
      plan,
      subscription_status: b.subscription_status ?? null,
      created_at: b.created_at,
      reviewCount,
      reviewsThisMonth,
      pageViews,
    });
  }

  return rows;
}

export async function getPlatformTotals(rows: AdminBusinessRow[]) {
  return {
    businesses: rows.length,
    totalReviews: rows.reduce((sum, row) => sum + row.reviewCount, 0),
    activePlans: rows.filter((row) => row.plan === "active").length,
    trialPlans: rows.filter((row) => row.plan === "trial").length,
  };
}
