import { createServiceClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slugify";
import type { ServiceCategory, ServiceProvider, ServiceRequest } from "@/lib/types";

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const admin = createServiceClient();
  if (!admin) return [];

  const { data } = await admin
    .from("service_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (data || []) as ServiceCategory[];
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getServiceCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export async function getApprovedProviders(filters?: {
  citySlug?: string;
  categorySlug?: string;
  featuredOnly?: boolean;
}) {
  const admin = createServiceClient();
  if (!admin) return [];

  let query = admin
    .from("service_providers")
    .select("*")
    .eq("status", "approved")
    .order("featured", { ascending: false })
    .order("display_name", { ascending: true });

  if (filters?.citySlug) query = query.eq("city_slug", filters.citySlug);
  if (filters?.categorySlug) query = query.eq("category_slug", filters.categorySlug);
  if (filters?.featuredOnly) query = query.eq("featured", true);

  const { data } = await query;
  return (data || []) as ServiceProvider[];
}

export async function getProviderBySlug(slug: string) {
  const admin = createServiceClient();
  if (!admin) return null;

  const { data } = await admin
    .from("service_providers")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  return data as ServiceProvider | null;
}

export async function incrementContactClicks(providerId: string) {
  const admin = createServiceClient();
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
}) {
  const admin = createServiceClient();
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
}) {
  const admin = createServiceClient();
  if (!admin) return { ok: false as const, error: "Server not configured" };

  const { data, error } = await admin
    .from("service_requests")
    .insert({
      category_slug: input.categorySlug,
      city_slug: input.citySlug,
      customer_name: input.customerName.trim(),
      customer_phone: input.customerPhone.trim(),
      customer_email: input.customerEmail?.trim() || null,
      description: input.description.trim(),
    })
    .select("id")
    .single();

  if (error || !data) return { ok: false as const, error: error?.message || "Could not submit" };
  return { ok: true as const, id: data.id };
}

export async function getAdminProviders(status?: string) {
  const admin = createServiceClient();
  if (!admin) return [];

  let query = admin.from("service_providers").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data } = await query;
  return (data || []) as ServiceProvider[];
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

export async function updateProviderAdmin(
  id: string,
  patch: Partial<Pick<ServiceProvider, "status" | "featured" | "display_name" | "phone" | "bio">>
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
