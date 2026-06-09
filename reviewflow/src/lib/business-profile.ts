import {
  getSeedBusinessBySlug,
  getSeedReviewsBySlug,
  SEED_BUSINESSES,
} from "@/data/seed-businesses";
import { createClient } from "@/lib/supabase/server";
import type {
  PublicBusiness,
  PublicReview,
  RatingBreakdown,
} from "@/lib/types";

function mapBusiness(row: Record<string, unknown>): PublicBusiness {
  const gallery = row.gallery_photos as string[] | undefined;
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    business_type: row.business_type as string,
    description: row.description as string | null,
    cover_photo_url: row.cover_photo_url as string | null,
    logo_url: row.logo_url as string | null,
    address: row.address as string | null,
    city: row.city as string | null,
    province: row.province as string | null,
    postal_code: row.postal_code as string | null,
    phone: row.phone as string | null,
    website: row.website as string | null,
    hours: row.hours as PublicBusiness["hours"],
    price_range: row.price_range as number | null,
    amenities: row.amenities as string[] | null,
    is_claimed: row.is_claimed as boolean,
    is_listed: row.is_listed !== false,
    avg_rating: row.avg_rating != null ? Number(row.avg_rating) : null,
    review_count: row.review_count as number | null,
    ai_summary: row.ai_summary as string | null,
    ai_summary_tags: row.ai_summary_tags as string[] | null,
    is_open_now: computeIsOpen(row.hours as PublicBusiness["hours"]),
    gallery_photos: gallery ?? [],
  };
}

function computeIsOpen(hours: PublicBusiness["hours"]): boolean {
  if (!hours) return false;
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const now = new Date();
  const dayKey = days[now.getDay()];
  const today = hours[dayKey];
  if (!today || today.closed) return false;
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = today.open.split(":").map(Number);
  const [closeH, closeM] = today.close.split(":").map(Number);
  const openMins = openH * 60 + openM;
  const closeMins = closeH * 60 + closeM;
  return nowMins >= openMins && nowMins < closeMins;
}

export async function getBusinessProfile(slug: string): Promise<PublicBusiness | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      const biz = mapBusiness(data as Record<string, unknown>);
      if (biz.is_listed === false) return null;

      const { data: photos } = await supabase
        .from("business_photos")
        .select("url")
        .eq("business_id", data.id)
        .order("sort_order");

      if (photos?.length) {
        biz.gallery_photos = photos.map((p) => p.url);
      }

      return biz;
    }
  } catch {
    // fall through
  }

  return getSeedBusinessBySlug(slug);
}

export async function getBusinessReviews(
  slug: string,
  options?: { starFilter?: number; sort?: "recent" | "helpful" | "highest" | "lowest" }
): Promise<PublicReview[]> {
  const profile = await getBusinessProfile(slug);
  if (!profile) return [];

  let reviews: PublicReview[] = [];

  try {
    const supabase = await createClient();
    const { data: reviewRows } = await supabase
      .from("reviews")
      .select(
        "id, business_id, author_name, author_avatar_url, star_rating, body, sub_ratings, helpful_count, is_verified_visit, created_at"
      )
      .eq("business_id", profile.id)
      .eq("is_public", true);

    if (reviewRows?.length) {
      for (const row of reviewRows) {
        const { data: photos } = await supabase
          .from("review_photos")
          .select("url")
          .eq("review_id", row.id)
          .order("sort_order");

        const { data: response } = await supabase
          .from("review_responses")
          .select("body, created_at")
          .eq("review_id", row.id)
          .maybeSingle();

        reviews.push({
          id: row.id,
          business_id: row.business_id,
          author_name: row.author_name,
          author_avatar_url: row.author_avatar_url,
          star_rating: row.star_rating,
          body: row.body,
          sub_ratings: row.sub_ratings,
          helpful_count: row.helpful_count ?? 0,
          is_verified_visit: row.is_verified_visit ?? false,
          created_at: row.created_at,
          photos: photos?.map((p) => p.url) ?? [],
          owner_response: response
            ? { body: response.body, created_at: response.created_at }
            : null,
        });
      }
    }
  } catch {
    // fall through
  }

  if (reviews.length === 0) {
    reviews = getSeedReviewsBySlug(slug);
  }

  if (options?.starFilter) {
    reviews = reviews.filter((r) => r.star_rating === options.starFilter);
  }

  const sort = options?.sort ?? "recent";
  reviews.sort((a, b) => {
    switch (sort) {
      case "helpful":
        return b.helpful_count - a.helpful_count;
      case "highest":
        return b.star_rating - a.star_rating;
      case "lowest":
        return a.star_rating - b.star_rating;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return reviews;
}

export function getRatingBreakdown(reviews: PublicReview[]): RatingBreakdown {
  const breakdown: RatingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviews) {
    const key = r.star_rating as keyof RatingBreakdown;
    if (key >= 1 && key <= 5) breakdown[key]++;
  }
  return breakdown;
}

export function getAllSeedSlugs(): string[] {
  return SEED_BUSINESSES.map((b) => b.slug);
}
