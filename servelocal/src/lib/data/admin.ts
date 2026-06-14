import { createServiceClient } from "@/lib/supabase/admin";
import type { ProviderReview, ServiceProvider, ServiceRequest, SiteSuggestion } from "@/lib/types";
import { parseServiceProviders } from "@/lib/schemas/db";
import { refreshProviderRating } from "./reviews";

export async function getAdminProviders(status?: string) {
  const admin = createServiceClient();
  if (!admin) return [];

  let query = admin.from("service_providers").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data } = await query;
  return parseServiceProviders(data || []);
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

export async function createSiteSuggestion(input: {
  message: string;
  email?: string;
  pageUrl?: string;
}) {
  const { createDbClient } = await import("@/lib/supabase/admin");
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

export async function createContactMessage(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const { createDbClient } = await import("@/lib/supabase/admin");
  const admin = createDbClient();
  if (!admin) {
    return createSiteSuggestion({
      message: `[Contact] ${input.name}: ${input.subject || ""} — ${input.message}`,
      email: input.email,
    });
  }

  try {
    const { error } = await admin.from("contact_messages").insert({
      name: input.name.trim(),
      email: input.email.trim(),
      subject: input.subject?.trim() || null,
      message: input.message.trim(),
    });
    if (error) throw error;
    return { ok: true as const };
  } catch {
    return createSiteSuggestion({
      message: `[Contact] ${input.name}: ${input.subject || ""} — ${input.message}`,
      email: input.email,
    });
  }
}

export async function subscribeNewsletter(email: string) {
  const { createDbClient } = await import("@/lib/supabase/admin");
  const admin = createDbClient();
  if (!admin) {
    return createSiteSuggestion({
      message: `[Newsletter] Subscribe: ${email}`,
      email,
    });
  }

  try {
    const { error } = await admin.from("newsletter_subscribers").insert({ email: email.trim().toLowerCase() });
    if (error?.code === "23505") return { ok: true as const };
    if (error) throw error;
    return { ok: true as const };
  } catch {
    return createSiteSuggestion({
      message: `[Newsletter] Subscribe: ${email}`,
      email,
    });
  }
}
