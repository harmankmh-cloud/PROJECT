import { getSeedUser, SEED_USER_REVIEWS, SEED_USERS } from "@/data/seed-users";
import { createClient } from "@/lib/supabase/server";
import type { PublicReview, UserProfile } from "@/lib/types";

export async function getUserProfile(id: string): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
    if (data) {
      return {
        id: data.id,
        display_name: data.display_name,
        avatar_url: data.avatar_url,
        city: data.city,
        tier: data.tier,
        review_count: data.review_count,
        photo_count: data.photo_count,
        helpful_received: data.helpful_received,
        helpful_given: data.helpful_given,
        joined_at: data.created_at,
      };
    }
  } catch {
    // fall through
  }
  return getSeedUser(id);
}

export async function getUserReviews(userId: string): Promise<PublicReview[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .eq("is_public", true)
      .order("created_at", { ascending: false });
    if (data?.length) {
      return data.map((r) => ({
        id: r.id,
        business_id: r.business_id,
        author_name: r.author_name,
        star_rating: r.star_rating,
        body: r.body,
        helpful_count: r.helpful_count ?? 0,
        is_verified_visit: r.is_verified_visit ?? false,
        created_at: r.created_at,
        photos: [],
      }));
    }
  } catch {
    // fall through
  }
  return SEED_USER_REVIEWS[userId] ?? [];
}

export function getTierLabel(tier: UserProfile["tier"]) {
  const labels = { newbie: "Newbie", contributor: "Contributor", expert: "Local Expert", elite: "Elite" };
  return labels[tier];
}

export function listSeedUserIds() {
  return SEED_USERS.map((u) => u.id);
}
