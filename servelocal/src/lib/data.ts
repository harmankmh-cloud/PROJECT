import { createDbClient, createServiceClient } from "@/lib/supabase/admin";
import { DEFAULT_SERVICE_CATEGORIES } from "@/lib/constants";
import { slugify } from "@/lib/slugify";
import type {
  ProviderFilters,
  ProviderReview,
  ProviderSort,
  ServiceCategory,
  ServiceProvider,
  ServiceRequest,
  SiteSuggestion,
} from "@/lib/types";

const TIER_RANK: Record<string, number> = { premium: 0, featured: 1, free: 2 };

function normalizeProvider(row: Record<string, unknown>): ServiceProvider {
  const p = row as ServiceProvider;
  return {
    ...p,
    listing_tier: (p.listing_tier as ServiceProvider["listing_tier"]) || "free",
    verified: p.verified ?? false,
    insurance_verified: p.insurance_verified ?? false,
    portfolio_urls: p.portfolio_urls ?? [],
    jobs_completed: p.jobs_completed ?? 0,
    emergency_available: p.emergency_available ?? false,
    avg_rating: Number(p.avg_rating ?? 0),
    review_count: p.review_count ?? 0,
    requested_plan: p.requested_plan ?? "free",
  };
}

function sortProviders(list: ServiceProvider[], sort: ProviderSort = "recommended") {
  const ranked = [...list].sort((a, b) => {
    const tierDiff = (TIER_RANK[a.listing_tier || "free"] ?? 2) - (TIER_RANK[b.listing_tier || "free"] ?? 2);
    if (tierDiff !== 0) return tierDiff;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;

    if (sort === "rating") return (b.avg_rating || 0) - (a.avg_rating || 0);
    if (sort === "experience") return (b.years_experience || 0) - (a.years_experience || 0);
    if (sort === "reviews") return (b.review_count || 0) - (a.review_count || 0);

    const scoreA = (a.avg_rating || 0) * 10 + (a.review_count || 0) + (a.featured ? 5 : 0);
    const scoreB = (b.avg_rating || 0) * 10 + (b.review_count || 0) + (b.featured ? 5 : 0);
    if (scoreB !== scoreA) return scoreB - scoreA;
    return a.display_name.localeCompare(b.display_name);
  });
  return ranked;
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const admin = createDbClient();
  if (!admin) return DEFAULT_SERVICE_CATEGORIES;

  const { data, error } = await admin
    .from("service_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return DEFAULT_SERVICE_CATEGORIES;

  const dbCats = (data || []) as ServiceCategory[];
  const bySlug = new Map<string, ServiceCategory>();
  for (const c of DEFAULT_SERVICE_CATEGORIES) bySlug.set(c.slug, c);
  for (const c of dbCats) bySlug.set(c.slug, c);

  return [...bySlug.values()].sort((a, b) => a.sort_order - b.sort_order);
}

export async function getUserServiceRequests(userId: string, email?: string) {
  const admin = createServiceClient() ?? createDbClient();
  if (!admin) return [];

  const { data: byUser } = await admin
    .from("service_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (byUser?.length) return byUser as ServiceRequest[];

  if (!email) return [];

  const { data: byEmail } = await admin
    .from("service_requests")
    .select("*")
    .eq("customer_email", email)
    .order("created_at", { ascending: false })
    .limit(50);

  return (byEmail || []) as ServiceRequest[];
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getServiceCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export async function getApprovedProviders(filters: ProviderFilters = {}) {
  const admin = createDbClient();
  if (!admin) return [];

  let query = admin.from("service_providers").select("*").eq("status", "approved");

  if (filters.citySlug) query = query.eq("city_slug", filters.citySlug);
  if (filters.categorySlug) query = query.eq("category_slug", filters.categorySlug);
  if (filters.featuredOnly) query = query.eq("featured", true);
  if (filters.licensedOnly) query = query.eq("licensed", true);
  if (filters.verifiedOnly) query = query.eq("verified", true);
  if (filters.emergencyOnly) query = query.eq("emergency_available", true);

  const { data } = await query;
  let list = ((data || []) as ServiceProvider[]).map((row) =>
    normalizeProvider(row as unknown as Record<string, unknown>)
  );

  if (filters.query?.trim()) {
    const q = filters.query.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.display_name.toLowerCase().includes(q) ||
        (p.bio || "").toLowerCase().includes(q) ||
        p.category_slug.includes(q) ||
        p.city_slug.includes(q)
    );
  }

  return sortProviders(list, filters.sort || "recommended");
}

export async function searchProviders(query: string, limit = 24) {
  return (await getApprovedProviders({ query })).slice(0, limit);
}

export async function getProviderBySlug(slug: string) {
  const admin = createDbClient();
  if (!admin) return null;

  const { data } = await admin
    .from("service_providers")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  return data ? normalizeProvider(data as unknown as Record<string, unknown>) : null;
}

export async function getPlatformStats() {
  const admin = createDbClient();
  if (!admin) {
    return { providers: 0, verified: 0, reviews: 0, cities: 8 };
  }

  try {
    const [{ count: providers }, { count: verified }, { count: reviews }] = await Promise.all([
      admin.from("service_providers").select("*", { count: "exact", head: true }).eq("status", "approved"),
      admin.from("service_providers").select("*", { count: "exact", head: true }).eq("status", "approved").eq("verified", true),
      admin.from("provider_reviews").select("*", { count: "exact", head: true }).eq("status", "approved"),
    ]);

    return {
      providers: providers || 0,
      verified: verified || 0,
      reviews: reviews || 0,
      cities: 8,
    };
  } catch {
    const { count: providers } = await admin
      .from("service_providers")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved");
    return { providers: providers || 0, verified: 0, reviews: 0, cities: 8 };
  }
}

export async function getProviderReviews(providerId: string, limit = 20) {
  const admin = createDbClient();
  if (!admin) return [];

  try {
    const { data } = await admin
      .from("provider_reviews")
      .select("*")
      .eq("provider_id", providerId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(limit);

    return (data || []) as ProviderReview[];
  } catch {
    return [];
  }
}

export async function createProviderReview(input: {
  providerId: string;
  reviewerName: string;
  rating: number;
  title?: string;
  body: string;
}) {
  const admin = createDbClient();
  if (!admin) return { ok: false as const, error: "Server not configured" };

  const { error } = await admin.from("provider_reviews").insert({
    provider_id: input.providerId,
    reviewer_name: input.reviewerName.trim(),
    rating: input.rating,
    title: input.title?.trim() || null,
    body: input.body.trim(),
    status: "pending",
  });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

async function refreshProviderRating(providerId: string) {
  const admin = createServiceClient();
  if (!admin) return;

  const { data: reviews } = await admin
    .from("provider_reviews")
    .select("rating")
    .eq("provider_id", providerId)
    .eq("status", "approved");

  const list = reviews || [];
  const count = list.length;
  const avg = count ? list.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  await admin
    .from("service_providers")
    .update({
      avg_rating: Math.round(avg * 100) / 100,
      review_count: count,
      updated_at: new Date().toISOString(),
    })
    .eq("id", providerId);
}

export async function incrementContactClicks(providerId: string) {
  const admin = createDbClient();
  if (!admin) return;

  const { data } = await admin.from("service_providers").select("contact_clicks").eq("id", providerId).single();
  if (!data) return;

  await admin
    .from("service_providers")
    .update({
      contact_clicks: (data.contact_clicks || 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", providerId);
}

export async function createProviderApplication(input: {
  displayName: string;
  categorySlug: string;
  citySlug: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  bio?: string;
  yearsExperience?: number;
  licensed?: boolean;
  licenseNumber?: string;
  website?: string;
  emergencyAvailable?: boolean;
  requestedPlan?: string;
  minCalloutFee?: string;
  businessHours?: string;
}) {
  const admin = createDbClient();
  if (!admin) return { ok: false as const, error: "Server not configured" };

  const baseSlug = slugify(input.displayName) || "pro";
  let slug = baseSlug;
  let suffix = 1;

  while (suffix < 100) {
    const { data: existing } = await admin.from("service_providers").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const { data, error } = await admin
    .from("service_providers")
    .insert({
      slug,
      display_name: input.displayName.trim(),
      category_slug: input.categorySlug,
      city_slug: input.citySlug,
      phone: input.phone.trim(),
      email: input.email?.trim() || null,
      whatsapp: input.whatsapp?.trim() || null,
      bio: input.bio?.trim() || null,
      years_experience: input.yearsExperience ?? null,
      licensed: input.licensed ?? false,
      license_number: input.licenseNumber?.trim() || null,
      website: input.website?.trim() || null,
      emergency_available: input.emergencyAvailable ?? false,
      requested_plan: input.requestedPlan || "free",
      min_callout_fee: input.minCalloutFee?.trim() || null,
      business_hours: input.businessHours?.trim() || null,
      status: "pending",
    })
    .select("id, slug")
    .single();

  if (error || !data) return { ok: false as const, error: error?.message || "Could not submit" };
  return { ok: true as const, id: data.id, slug: data.slug };
}

export async function createServiceRequest(input: {
  categorySlug: string;
  citySlug: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  description: string;
  userId?: string;
}) {
  const admin = createDbClient();
  if (!admin) return { ok: false as const, error: "Server not configured" };

  const row: Record<string, unknown> = {
    category_slug: input.categorySlug,
    city_slug: input.citySlug,
    customer_name: input.customerName.trim(),
    customer_phone: input.customerPhone.trim(),
    customer_email: input.customerEmail?.trim() || null,
    description: input.description.trim(),
  };

  if (input.userId) {
    row.user_id = input.userId;
  }

  let { data, error } = await admin.from("service_requests").insert(row).select("id").single();

  if (error?.message?.includes("user_id") && row.user_id) {
    const withoutUser = { ...row };
    delete withoutUser.user_id;
    ({ data, error } = await admin.from("service_requests").insert(withoutUser).select("id").single());
  }

  if (error || !data) return { ok: false as const, error: error?.message || "Could not submit" };

  const matches = await getApprovedProviders({
    citySlug: input.citySlug,
    categorySlug: input.categorySlug,
    sort: "recommended",
  });

  return { ok: true as const, id: data.id, matches: matches.slice(0, 6) };
}

export async function getAdminProviders(status?: string) {
  const admin = createServiceClient();
  if (!admin) return [];

  let query = admin.from("service_providers").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data } = await query;
  return ((data || []) as ServiceProvider[]).map((row) =>
    normalizeProvider(row as unknown as Record<string, unknown>)
  );
}

export async function getAdminServiceRequests(limit = 50) {
  const admin = createServiceClient();
  if (!admin) return [];

  const { data } = await admin
    .from("service_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data || []) as ServiceRequest[];
}

export async function getAdminReviews(limit = 50) {
  const admin = createServiceClient();
  if (!admin) return [];

  try {
    const { data } = await admin
      .from("provider_reviews")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(limit);

    return (data || []) as ProviderReview[];
  } catch {
    return [];
  }
}

export async function updateProviderAdmin(
  id: string,
  patch: Partial<
    Pick<
      ServiceProvider,
      | "status"
      | "featured"
      | "display_name"
      | "phone"
      | "bio"
      | "listing_tier"
      | "verified"
      | "insurance_verified"
      | "response_time"
      | "jobs_completed"
      | "emergency_available"
    >
  >
) {
  const admin = createServiceClient();
  if (!admin) return { ok: false as const, error: "Server not configured" };

  const { error } = await admin
    .from("service_providers")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function updateReviewAdmin(id: string, status: "approved" | "rejected") {
  const admin = createServiceClient();
  if (!admin) return { ok: false as const, error: "Server not configured" };

  const { data: review, error } = await admin
    .from("provider_reviews")
    .update({ status })
    .eq("id", id)
    .select("provider_id")
    .single();

  if (error || !review) return { ok: false as const, error: error?.message || "Update failed" };

  if (status === "approved") {
    await refreshProviderRating(review.provider_id);
  }

  return { ok: true as const };
}

export async function createSiteSuggestion(input: {
  message: string;
  email?: string;
  pageUrl?: string;
}) {
  const admin = createDbClient();
  if (!admin) return { ok: false as const, error: "Server not configured" };

  try {
    const { error } = await admin.from("site_suggestions").insert({
      message: input.message.trim(),
      email: input.email?.trim() || null,
      page_url: input.pageUrl?.trim() || null,
    });

    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Suggestions not available yet" };
  }
}

export async function getAdminSuggestions(limit = 50) {
  const admin = createServiceClient();
  if (!admin) return [];

  try {
    const { data } = await admin
      .from("site_suggestions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    return (data || []) as SiteSuggestion[];
  } catch {
    return [];
  }
}

export async function updateSuggestionAdmin(id: string, status: "read" | "done") {
  const admin = createServiceClient();
  if (!admin) return { ok: false as const, error: "Server not configured" };

  const { error } = await admin.from("site_suggestions").update({ status }).eq("id", id);

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
