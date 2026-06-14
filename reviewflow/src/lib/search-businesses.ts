import { SEED_BUSINESSES } from "@/data/seed-businesses";
import { createClient } from "@/lib/supabase/server";
import type { PublicBusiness } from "@/lib/types";

export type SearchFilters = {
  q?: string;
  city?: string;
  category?: string;
  openNow?: boolean;
  minRating?: number;
  priceRange?: number[];
  hasPhotos?: boolean;
  respondsToReviews?: boolean;
  newlyAdded?: boolean;
  sort?: "match" | "rating" | "reviews" | "closest";
  page?: number;
  limit?: number;
};

function mapRow(row: Record<string, unknown>): PublicBusiness {
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
    phone: row.phone as string | null,
    hours: row.hours as PublicBusiness["hours"],
    price_range: row.price_range as number | null,
    is_claimed: row.is_claimed as boolean,
    is_listed: row.is_listed !== false,
    avg_rating: row.avg_rating != null ? Number(row.avg_rating) : null,
    review_count: row.review_count as number | null,
    is_open_now: row.is_open_now as boolean | undefined,
    gallery_photos: (row.gallery_photos as string[]) ?? [],
    top_review_snippet: row.top_review_snippet as string | undefined,
    distance_km: row.distance_km as number | undefined,
    is_sponsored: row.is_sponsored as boolean | undefined,
  };
}

function filterBusinesses(list: PublicBusiness[], filters: SearchFilters): PublicBusiness[] {
  let results = list.filter((b) => b.is_listed !== false);

  if (filters.q) {
    const q = filters.q.toLowerCase();
    results = results.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.business_type.toLowerCase().includes(q) ||
        b.city?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q)
    );
  }
  if (filters.city) {
    results = results.filter((b) => b.city?.toLowerCase() === filters.city!.toLowerCase());
  }
  if (filters.category) {
    results = results.filter(
      (b) => b.business_type.toLowerCase() === filters.category!.toLowerCase()
    );
  }
  if (filters.openNow) {
    results = results.filter((b) => b.is_open_now);
  }
  if (filters.minRating) {
    results = results.filter((b) => (b.avg_rating ?? 0) >= filters.minRating!);
  }
  if (filters.priceRange?.length) {
    results = results.filter(
      (b) => b.price_range && filters.priceRange!.includes(b.price_range)
    );
  }
  if (filters.hasPhotos) {
    results = results.filter(
      (b) => b.cover_photo_url || (b.gallery_photos && b.gallery_photos.length > 0)
    );
  }

  const sort = filters.sort ?? "match";
  results.sort((a, b) => {
    switch (sort) {
      case "rating":
        return (b.avg_rating ?? 0) - (a.avg_rating ?? 0);
      case "reviews":
        return (b.review_count ?? 0) - (a.review_count ?? 0);
      case "closest":
        return (a.distance_km ?? 99) - (b.distance_km ?? 99);
      default:
        return (b.avg_rating ?? 0) - (a.avg_rating ?? 0);
    }
  });

  return results;
}

export async function searchBusinesses(
  filters: SearchFilters
): Promise<{ businesses: PublicBusiness[]; total: number }> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;

  let all: PublicBusiness[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("businesses")
      .select("*")
      .eq("is_listed", true);

    if (data?.length) {
      all = data.map((row) => mapRow(row as Record<string, unknown>));
    }
  } catch {
    // fall through
  }

  if (all.length === 0) {
    all = SEED_BUSINESSES.map((b, i) => ({
      ...b,
      distance_km: 0.5 + i * 1.2,
      top_review_snippet:
        i === 0
          ? "Absolutely loved our dinner here! The seasonal risotto was incredible..."
          : undefined,
      is_sponsored: i === 0,
    }));
  }

  const filtered = filterBusinesses(all, filters);
  const start = (page - 1) * limit;
  const businesses = filtered.slice(start, start + limit);

  return { businesses, total: filtered.length };
}

export async function getAllListedBusinesses(): Promise<PublicBusiness[]> {
  const { businesses, total } = await searchBusinesses({ limit: 100 });
  return businesses.length > 0 ? businesses : SEED_BUSINESSES;
}
