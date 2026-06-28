import { createDbClient, createServiceClient } from "@/lib/supabase/admin";
import { createUserDbClient } from "@/lib/supabase/user-db";
import { DEFAULT_SERVICE_CATEGORIES, nearbyCitySlugs } from "@/lib/constants";
import { slugify } from "@/lib/slugify";
import { parseServiceProvider, parseServiceProviders, sortProviders } from "@/lib/schemas/db";
import type { ProviderFilters, ServiceCategory, ServiceProvider } from "@/lib/types";

type PublicProviderQuery<T> = {
  not(column: string, operator: string, value: unknown): T;
  neq(column: string, value: unknown): T;
  or(filters: string): T;
};

function withPublicProviderFilters<T extends PublicProviderQuery<T>>(query: T): T {
  return query
    .not("owner_user_id", "is", null)
    .or("email.is.null,email.not.ilike.%.example")
    .not("phone", "like", "604-555-%")
    .neq("display_name", "Harman plumbing");
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

export async function getCategoryBySlug(slug: string) {
  const categories = await getServiceCategories();
  return categories.find((c) => c.slug === slug) || null;
}

/** Listings owned by the signed-in user (RLS enforced). */
export async function getProvidersForUser(userId: string) {
  const ctx = await createUserDbClient();
  if (!ctx || ctx.user.id !== userId) return [];

  const { data, error } = await ctx.supabase
    .from("service_providers")
    .select("*")
    .eq("owner_user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return [];
  return parseServiceProviders(data);
}

/**
 * One-time claim for legacy listings: auth email must match listing email and owner_user_id must be null.
 */
export async function claimProviderListing(userId: string, userEmail: string, providerId: string) {
  const admin = createServiceClient();
  if (!admin) return { ok: false as const, error: "Not configured" };

  const { data: listing, error: fetchError } = await admin
    .from("service_providers")
    .select("id, email, owner_user_id")
    .eq("id", providerId)
    .maybeSingle();

  if (fetchError || !listing) return { ok: false as const, error: "Listing not found" };
  if (listing.owner_user_id) return { ok: false as const, error: "Listing already claimed" };

  const listingEmail = (listing.email as string | null)?.trim().toLowerCase();
  const authEmail = userEmail.trim().toLowerCase();
  if (!listingEmail || listingEmail !== authEmail) {
    return { ok: false as const, error: "Your account email must match the listing email to claim it" };
  }

  const { error } = await admin
    .from("service_providers")
    .update({ owner_user_id: userId, updated_at: new Date().toISOString() })
    .eq("id", providerId)
    .is("owner_user_id", null);

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function getApprovedProviders(
  filters: ProviderFilters & { page?: number; pageSize?: number } = {}
) {
  const admin = createDbClient();
  if (!admin) return [];

  const page = Math.max(0, filters.page ?? 0);
  const pageSize = Math.min(50, Math.max(1, filters.pageSize ?? 24));
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = withPublicProviderFilters(
    admin.from("service_providers").select("*").eq("status", "approved")
  );

  if (filters.citySlug) query = query.eq("city_slug", filters.citySlug);
  if (filters.categorySlug) query = query.eq("category_slug", filters.categorySlug);
  if (filters.featuredOnly) query = query.eq("featured", true);
  if (filters.licensedOnly) query = query.eq("licensed", true);
  if (filters.verifiedOnly) query = query.eq("verified", true);
  if (filters.emergencyOnly) query = query.eq("emergency_available", true);

  query = query.range(from, to);

  const { data } = await query;
  let list = parseServiceProviders(data || []);

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

export async function getApprovedProvidersWithFallback(filters: ProviderFilters = {}) {
  const primary = await getApprovedProviders(filters);
  if (primary.length > 0 || !filters.citySlug) {
    return { providers: primary, fallbackProviders: [] as ServiceProvider[], usedFallback: false };
  }

  const adjacent = nearbyCitySlugs(filters.citySlug);
  const seen = new Set<string>();
  const fallbackProviders: ServiceProvider[] = [];

  for (const citySlug of adjacent) {
    const batch = await getApprovedProviders({ ...filters, citySlug });
    for (const p of batch) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        fallbackProviders.push(p);
      }
    }
    if (fallbackProviders.length >= 6) break;
  }

  return {
    providers: primary,
    fallbackProviders: sortProviders(fallbackProviders, filters.sort || "recommended").slice(0, 6),
    usedFallback: fallbackProviders.length > 0,
  };
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
    .not("owner_user_id", "is", null)
    .or("email.is.null,email.not.ilike.%.example")
    .not("phone", "like", "604-555-%")
    .neq("display_name", "Harman plumbing")
    .maybeSingle();

  return data ? parseServiceProvider(data) : null;
}

export async function getProviderById(id: string) {
  const admin = createServiceClient() ?? createDbClient();
  if (!admin) return null;

  const { data } = await admin.from("service_providers").select("*").eq("id", id).maybeSingle();
  return data ? parseServiceProvider(data) : null;
}

export async function getPlatformStats() {
  const admin = createDbClient();
  if (!admin) {
    return { providers: 0, verified: 0, reviews: 0, cities: 8 };
  }

  try {
    const [{ count: providers }, { count: verified }, { count: reviews }, { data: cities }] = await Promise.all([
      withPublicProviderFilters(
        admin.from("service_providers").select("*", { count: "exact", head: true }).eq("status", "approved")
      ),
      withPublicProviderFilters(
        admin
          .from("service_providers")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved")
          .eq("verified", true)
      ),
      admin.from("provider_reviews").select("*", { count: "exact", head: true }).eq("status", "approved"),
      withPublicProviderFilters(
        admin.from("service_providers").select("city_slug").eq("status", "approved")
      ),
    ]);
    const cityCount = new Set((cities || []).map((row) => row.city_slug).filter(Boolean)).size;

    return {
      providers: providers || 0,
      verified: verified || 0,
      reviews: reviews || 0,
      cities: cityCount,
    };
  } catch {
    const { count: providers } = await withPublicProviderFilters(
      admin.from("service_providers").select("*", { count: "exact", head: true }).eq("status", "approved")
    );
    return { providers: providers || 0, verified: 0, reviews: 0, cities: providers ? 1 : 0 };
  }
}

export async function incrementContactClicks(providerId: string) {
  // Prefer service role; anon UPDATE only works when 006_contact policy is applied
  const admin = createServiceClient() ?? createDbClient();
  if (!admin) return;

  const { data, error: readError } = await admin
    .from("service_providers")
    .select("contact_clicks")
    .eq("id", providerId)
    .single();
  if (readError || !data) return;

  const { error: writeError } = await admin
    .from("service_providers")
    .update({
      contact_clicks: (data.contact_clicks || 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", providerId);

  if (writeError && process.env.NODE_ENV !== "production") {
    console.warn("[incrementContactClicks]", writeError.message);
  }
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
  ownerUserId?: string;
}) {
  const admin = createDbClient();
  if (!admin) return { ok: false as const, error: "Server not configured" };

  const baseSlug = slugify(input.displayName) || "pro";
  const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;

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
      owner_user_id: input.ownerUserId || null,
    })
    .select("id, slug")
    .single();

  if (error || !data) return { ok: false as const, error: error?.message || "Could not submit" };
  return { ok: true as const, id: data.id, slug: data.slug };
}

export async function updateProviderOwner(
  providerId: string,
  ownerUserId: string,
  patch: Partial<
    Pick<
      ServiceProvider,
      | "display_name"
      | "phone"
      | "bio"
      | "years_experience"
      | "license_number"
      | "website"
      | "business_hours"
      | "min_callout_fee"
      | "emergency_available"
      | "whatsapp"
      | "portfolio_urls"
    >
  >
) {
  const admin = createServiceClient() ?? createDbClient();
  if (!admin) return { ok: false as const, error: "Server not configured" };

  const { data: listing } = await admin
    .from("service_providers")
    .select("id")
    .eq("id", providerId)
    .eq("owner_user_id", ownerUserId)
    .maybeSingle();

  if (!listing) return { ok: false as const, error: "Not authorized" };

  const { error } = await admin
    .from("service_providers")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", providerId);

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
