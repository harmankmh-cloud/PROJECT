import { createServiceClient } from "@/lib/supabase/admin";
import { resolvePlan } from "@/lib/business-plan";
import { countReviewsThisMonth } from "@/lib/usage";
import type { Business } from "@/lib/types";

export type AdminFeedbackRow = {
  id: string;
  business_id: string;
  business_name: string;
  business_slug: string;
  star_rating: number | null;
  is_private: boolean;
  customer_notes: string | null;
  ai_draft: string | null;
  created_at: string;
};

export type PlatformExtendedTotals = {
  businesses: number;
  totalReviews: number;
  reviewsThisMonth: number;
  activePlans: number;
  trialPlans: number;
  totalPageViews: number;
  googleClicks: number;
  privateFeedback: number;
  newBusinessesThisMonth: number;
  estimatedMrrUsd: number;
};

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

export async function getAdminBusinessWithPrompts(businessId: string) {
  const admin = createServiceClient();
  if (!admin) return null;

  const { data: business } = await admin
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .maybeSingle();

  if (!business) return null;

  const { data: prompts } = await admin
    .from("prompt_templates")
    .select("*")
    .eq("business_id", businessId);

  return { business, prompts: prompts || [] };
}

export async function getPlatformTotals(rows: AdminBusinessRow[]) {
  return {
    businesses: rows.length,
    totalReviews: rows.reduce((sum, row) => sum + row.reviewCount, 0),
    activePlans: rows.filter((row) => row.plan === "active").length,
    trialPlans: rows.filter((row) => row.plan === "trial").length,
  };
}

export async function getPlatformExtendedTotals(rows: AdminBusinessRow[]): Promise<PlatformExtendedTotals> {
  const admin = createServiceClient();
  const base = await getPlatformTotals(rows);

  if (!admin) {
    return {
      ...base,
      reviewsThisMonth: 0,
      totalPageViews: 0,
      googleClicks: 0,
      privateFeedback: 0,
      newBusinessesThisMonth: 0,
      estimatedMrrUsd: base.activePlans * 39,
    };
  }

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const [pageViews, googleClicks, privateFeedback, reviewsThisMonth] = await Promise.all([
    admin
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "page_view")
      .then((r) => r.count || 0),
    admin
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "google_click")
      .then((r) => r.count || 0),
    admin
      .from("feedback_events")
      .select("*", { count: "exact", head: true })
      .eq("is_private", true)
      .then((r) => r.count || 0),
    admin
      .from("feedback_events")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthStart.toISOString())
      .then((r) => r.count || 0),
  ]);

  const newBusinessesThisMonth = rows.filter(
    (row) => new Date(row.created_at) >= monthStart
  ).length;

  return {
    ...base,
    reviewsThisMonth,
    totalPageViews: pageViews,
    googleClicks,
    privateFeedback,
    newBusinessesThisMonth,
    estimatedMrrUsd: base.activePlans * 39,
  };
}

export type PlatformActivityRow = {
  id: string;
  type: "signup" | "review" | "plan";
  businessName: string;
  detail: string;
  createdAt: string;
};

export type PlatformRevenueSummary = {
  activeSubscriptions: number;
  monthlyPlanCount: number;
  setupFeeCount: number;
  trialingCount: number;
  freePlanCount: number;
  pastDueCount: number;
  canceledCount: number;
  estimatedMrrUsd: number;
};

export async function getPlatformBusinesses(): Promise<AdminBusinessRow[]> {
  return getPlatformAdminData();
}

export async function getPlatformRevenueSummary(
  rows: AdminBusinessRow[] = []
): Promise<PlatformRevenueSummary> {
  const data = rows.length ? rows : await getPlatformAdminData();
  const admin = createServiceClient();

  let setupFeeCount = 0;
  if (admin) {
    const { count } = await admin
      .from("businesses")
      .select("*", { count: "exact", head: true })
      .not("setup_paid_at", "is", null);
    setupFeeCount = count || 0;
  }

  const activeSubscriptions = data.filter((row) => row.plan === "active").length;

  return {
    activeSubscriptions,
    monthlyPlanCount: activeSubscriptions,
    setupFeeCount,
    trialingCount: data.filter((row) => row.plan === "trial").length,
    freePlanCount: data.filter((row) => row.plan === "trial" && !row.subscription_status).length,
    pastDueCount: data.filter((row) => row.plan === "past_due").length,
    canceledCount: data.filter((row) => row.plan === "canceled").length,
    estimatedMrrUsd: activeSubscriptions * 39,
  };
}

export async function getPlatformActivity(limit = 80): Promise<PlatformActivityRow[]> {
  const admin = createServiceClient();
  if (!admin) return [];

  const perSource = Math.ceil(limit / 2);

  const [{ data: businesses }, { data: feedback }] = await Promise.all([
    admin
      .from("businesses")
      .select("id, name, plan, subscription_status, created_at")
      .order("created_at", { ascending: false })
      .limit(perSource),
    admin
      .from("feedback_events")
      .select("id, business_id, star_rating, is_private, created_at")
      .order("created_at", { ascending: false })
      .limit(perSource),
  ]);

  const businessMap = new Map(
    (businesses || []).map((b) => [b.id as string, b.name as string])
  );

  const activity: PlatformActivityRow[] = [];

  for (const business of businesses || []) {
    activity.push({
      id: `signup-${business.id}`,
      type: "signup",
      businessName: business.name as string,
      detail: `New business joined (${business.plan || "trial"})`,
      createdAt: business.created_at as string,
    });
  }

  for (const row of feedback || []) {
    const stars = row.star_rating ? `${row.star_rating}★` : "Review";
    const privacy = row.is_private ? "private feedback" : "Google-ready review";
    activity.push({
      id: `review-${row.id}`,
      type: "review",
      businessName: businessMap.get(row.business_id as string) || "Unknown",
      detail: `${stars} — ${privacy}`,
      createdAt: row.created_at as string,
    });
  }

  return activity
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getPlatformFeedback(
  limit = 100,
  options?: { privateOnly?: boolean }
): Promise<AdminFeedbackRow[]> {
  const admin = createServiceClient();
  if (!admin) return [];

  let query = admin
    .from("feedback_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options?.privateOnly) {
    query = query.eq("is_private", true);
  }

  const { data: feedback } = await query;

  if (!feedback?.length) return [];

  const businessIds = [...new Set(feedback.map((row) => row.business_id))];
  const { data: businesses } = await admin
    .from("businesses")
    .select("id, name, slug")
    .in("id", businessIds);

  const businessMap = new Map(
    (businesses || []).map((b) => [b.id, { name: b.name as string, slug: b.slug as string }])
  );

  return feedback.map((row) => {
    const business = businessMap.get(row.business_id);
    return {
      id: row.id,
      business_id: row.business_id,
      business_name: business?.name || "Unknown",
      business_slug: business?.slug || "",
      star_rating: row.star_rating,
      is_private: row.is_private,
      customer_notes: row.customer_notes,
      ai_draft: row.ai_draft,
      created_at: row.created_at,
    };
  });
}
