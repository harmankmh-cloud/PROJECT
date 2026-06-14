import { createDbClient } from "@/lib/supabase/admin";
import { createUserDbClient } from "@/lib/supabase/user-db";
import { isFeaturedTier } from "@/lib/schemas/db";
import { parseServiceRequests } from "@/lib/schemas/db/service-request";
import type { ServiceProvider, ServiceRequest } from "@/lib/types";
import { getApprovedProviders, getServiceCategories } from "./providers";

export async function getUserServiceRequests(userId: string) {
  const ctx = await createUserDbClient();
  if (!ctx || ctx.user.id !== userId) return [];

  const { data, error } = await ctx.supabase
    .from("service_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return parseServiceRequests(data) as ServiceRequest[];
}

export async function getServiceRequestById(
  requestId: string,
  userId: string
): Promise<ServiceRequest | null> {
  const ctx = await createUserDbClient();
  if (!ctx || ctx.user.id !== userId) return null;

  const { data, error } = await ctx.supabase
    .from("service_requests")
    .select("*")
    .eq("id", requestId)
    .maybeSingle();

  if (error || !data) return null;
  const request = parseServiceRequests([data])[0];
  if (!request || request.user_id !== userId) return null;
  return request as ServiceRequest;
}

export function groupRequestsByStatus(requests: ServiceRequest[]) {
  const open = requests.filter((r) => r.status === "open" || r.status === "new");
  const inProgress = requests.filter((r) =>
    ["matched", "quoted", "in_progress", "active"].includes(r.status)
  );
  const completed = requests.filter((r) => r.status === "completed" || r.status === "closed");
  return { open, inProgress, completed, all: requests };
}

export async function createServiceRequest(input: {
  categorySlug: string;
  citySlug: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  description: string;
  userId?: string;
  urgency?: string;
  budgetMin?: number;
  budgetMax?: number;
}) {
  const admin = createDbClient();
  if (!admin) return { ok: false as const, error: "Server not configured" };

  const row = {
    category_slug: input.categorySlug,
    city_slug: input.citySlug,
    customer_name: input.customerName.trim(),
    customer_phone: input.customerPhone.trim(),
    customer_email: input.customerEmail?.trim() || null,
    description: input.description.trim(),
    user_id: input.userId ?? null,
    urgency: input.urgency ?? null,
    budget_min: input.budgetMin ?? null,
    budget_max: input.budgetMax ?? null,
  };

  const { data, error } = await admin.from("service_requests").insert(row).select("id").single();

  if (error || !data) {
    return {
      ok: false as const,
      error: error?.message || "Could not submit. Run Supabase migration 004_schema_baseline.sql.",
    };
  }

  const matches = await getApprovedProviders({
    citySlug: input.citySlug,
    categorySlug: input.categorySlug,
    sort: "recommended",
  });

  return { ok: true as const, id: data.id, matches: matches.slice(0, 6) };
}

function formatBudgetRange(min?: number | null, max?: number | null) {
  if (min != null && max != null) return `$${min.toLocaleString()}–$${max.toLocaleString()}`;
  if (min != null) return `From $${min.toLocaleString()}`;
  if (max != null) return `Up to $${max.toLocaleString()}`;
  return null;
}

export async function notifyProsForJobRequest(input: {
  categorySlug: string;
  citySlug: string;
  customerName: string;
  customerPhone: string;
  description: string;
  urgency?: string;
  budgetMin?: number;
  budgetMax?: number;
}) {
  const matches = await getApprovedProviders({
    citySlug: input.citySlug,
    categorySlug: input.categorySlug,
    sort: "recommended",
  });

  const withEmail = matches.filter((p) => p.email?.trim());
  const ranked = [...withEmail].sort((a, b) => {
    const tier = (p: ServiceProvider) =>
      p.listing_tier === "premium" ? 0 : p.listing_tier === "featured" ? 1 : 2;
    return tier(a) - tier(b);
  });
  const notifyList = ranked.slice(0, 10);

  const categories = await getServiceCategories();
  const categoryName = categories.find((c) => c.slug === input.categorySlug)?.name || input.categorySlug;
  const budgetLabel = formatBudgetRange(input.budgetMin, input.budgetMax);

  const { sendTransactionalEmail } = await import("@/lib/email");
  const { jobLeadForProEmail } = await import("@/lib/email-templates");

  let sent = 0;
  for (const pro of notifyList) {
    const email = pro.email!.trim();
    const isFeatured = isFeaturedTier(pro.listing_tier) || pro.featured;
    const { subject, html } = jobLeadForProEmail({
      proName: pro.display_name,
      categoryName,
      citySlug: input.citySlug,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      description: input.description,
      urgency: input.urgency,
      budgetLabel,
      isFeatured,
    });
    const result = await sendTransactionalEmail({
      to: email,
      subject,
      html,
      template: "job_lead_pro",
    });
    if (result.ok) sent += 1;
  }

  return { sent, matched: withEmail.length };
}

/** Job leads scoped by RLS — pro must own an approved listing in the same city/category. */
export async function getJobLeadsForProvider(provider: ServiceProvider, limit = 10) {
  const ctx = await createUserDbClient();
  if (!ctx || provider.owner_user_id !== ctx.user.id) return [];

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const showFullPii = isFeaturedTier(provider.listing_tier) || provider.featured;

  const { data, error } = await ctx.supabase
    .from("service_requests")
    .select("*")
    .eq("category_slug", provider.category_slug)
    .eq("city_slug", provider.city_slug)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  const leads = parseServiceRequests(data) as ServiceRequest[];

  if (showFullPii) return leads;

  return leads.map((lead) => ({
    ...lead,
    customer_name: "Homeowner",
    customer_phone: "Upgrade to view",
    customer_email: null,
  }));
}
