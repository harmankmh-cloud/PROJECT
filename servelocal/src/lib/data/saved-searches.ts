import { createServiceClient } from "@/lib/supabase/admin";
import { createUserDbClient } from "@/lib/supabase/user-db";
import type { SavedSearch, ServiceProvider } from "@/lib/types";
import { getServiceCategories } from "./providers";

export async function getUserSavedSearches(userId: string) {
  const ctx = await createUserDbClient();
  if (!ctx || ctx.user.id !== userId) return [];

  try {
    const { data, error } = await ctx.supabase
      .from("saved_searches")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as SavedSearch[];
  } catch {
    return [];
  }
}

export async function createSavedSearch(input: {
  userId: string;
  email: string;
  label: string;
  query?: string;
  citySlug?: string;
  categorySlug?: string;
  licensedOnly?: boolean;
  verifiedOnly?: boolean;
  emergencyOnly?: boolean;
}) {
  const ctx = await createUserDbClient();
  if (!ctx || ctx.user.id !== input.userId) {
    return { ok: false as const, error: "Not authorized" };
  }

  try {
    const { data, error } = await ctx.supabase
      .from("saved_searches")
      .insert({
        user_id: input.userId,
        email: input.email.trim(),
        label: input.label.trim(),
        query: input.query?.trim() || null,
        city_slug: input.citySlug || null,
        category_slug: input.categorySlug || null,
        licensed_only: input.licensedOnly ?? false,
        verified_only: input.verifiedOnly ?? false,
        emergency_only: input.emergencyOnly ?? false,
      })
      .select("id")
      .single();

    if (error || !data) return { ok: false as const, error: error?.message || "Could not save" };
    return { ok: true as const, id: data.id };
  } catch {
    return { ok: false as const, error: "Saved searches not available yet" };
  }
}

export async function deleteSavedSearch(userId: string, searchId: string) {
  const ctx = await createUserDbClient();
  if (!ctx || ctx.user.id !== userId) {
    return { ok: false as const, error: "Not authorized" };
  }

  const { error } = await ctx.supabase.from("saved_searches").delete().eq("id", searchId).eq("user_id", userId);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

function savedSearchMatchesProvider(search: SavedSearch, provider: ServiceProvider) {
  if (search.licensed_only && !provider.licensed) return false;
  if (search.verified_only && !provider.verified) return false;
  if (search.emergency_only && !provider.emergency_available) return false;
  if (search.query?.trim()) {
    const q = search.query.trim().toLowerCase();
    const haystack =
      `${provider.display_name} ${provider.bio || ""} ${provider.category_slug} ${provider.city_slug}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

async function fetchMatchingSavedSearches(provider: ServiceProvider, admin: NonNullable<ReturnType<typeof createServiceClient>>) {
  const pageSize = 100;
  const matches: SavedSearch[] = [];
  let offset = 0;

  while (true) {
    let query = admin.from("saved_searches").select("*").eq("alerts_enabled", true);

    if (provider.city_slug) {
      query = query.or(`city_slug.is.null,city_slug.eq.${provider.city_slug}`);
    }
    if (provider.category_slug) {
      query = query.or(`category_slug.is.null,category_slug.eq.${provider.category_slug}`);
    }

    const { data, error } = await query.order("created_at", { ascending: true }).range(offset, offset + pageSize - 1);
    if (error || !data?.length) break;

    for (const row of data as SavedSearch[]) {
      if (savedSearchMatchesProvider(row, provider)) matches.push(row);
    }

    if (data.length < pageSize) break;
    offset += pageSize;
  }

  return matches;
}

export async function notifySavedSearchesForProvider(provider: ServiceProvider) {
  if (provider.status !== "approved") return { notified: 0 };

  const admin = createServiceClient();
  if (!admin) return { notified: 0 };

  let searches: SavedSearch[] = [];
  try {
    searches = await fetchMatchingSavedSearches(provider, admin);
  } catch {
    return { notified: 0 };
  }

  const { sendTransactionalEmail } = await import("@/lib/email");
  const { savedSearchAlertEmail } = await import("@/lib/email-templates");
  const categories = await getServiceCategories();
  const categoryName = categories.find((c) => c.slug === provider.category_slug)?.name || provider.category_slug;

  let notified = 0;
  for (const search of searches) {
    const since = search.last_notified_at ? new Date(search.last_notified_at).getTime() : 0;
    const created = new Date(provider.created_at).getTime();
    if (since && created <= since) continue;

    const { subject, html } = savedSearchAlertEmail({
      label: search.label,
      providerName: provider.display_name,
      categoryName,
      citySlug: provider.city_slug,
      providerSlug: provider.slug,
    });

    const result = await sendTransactionalEmail({
      to: search.email,
      subject,
      html,
      template: "saved_search_alert",
    });

    if (result.ok) {
      notified += 1;
      await admin
        .from("saved_searches")
        .update({ last_notified_at: new Date().toISOString() })
        .eq("id", search.id);
    }
  }

  return { notified };
}
