import { createDbClient, createServiceClient } from "@/lib/supabase/admin";
import type { ProviderReview } from "@/lib/types";

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

export async function getProviderReviewsForProvider(providerId: string, limit = 20) {
  const admin = createDbClient();
  if (!admin) return [];

  try {
    const { data } = await admin
      .from("provider_reviews")
      .select("*")
      .eq("provider_id", providerId)
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

export async function refreshProviderRating(providerId: string) {
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
