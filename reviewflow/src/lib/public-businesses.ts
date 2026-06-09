import {
  getSeedFeaturedBusinesses,
  SEED_BUSINESSES,
} from "@/data/seed-businesses";
import { createClient } from "@/lib/supabase/server";
import type { PublicBusiness } from "@/lib/types";

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
    postal_code: row.postal_code as string | null,
    phone: row.phone as string | null,
    website: row.website as string | null,
    hours: row.hours as PublicBusiness["hours"],
    price_range: row.price_range as number | null,
    amenities: row.amenities as string[] | null,
    is_claimed: row.is_claimed as boolean,
    is_listed: row.is_listed as boolean,
    avg_rating: row.avg_rating != null ? Number(row.avg_rating) : null,
    review_count: row.review_count as number | null,
    ai_summary: row.ai_summary as string | null,
    ai_summary_tags: row.ai_summary_tags as string[] | null,
    is_open_now: true,
    gallery_photos: [],
  };
}

export async function getFeaturedBusinesses(
  city?: string,
  limit = 6
): Promise<PublicBusiness[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("businesses")
      .select(
        "id, slug, name, business_type, description, cover_photo_url, logo_url, address, city, province, postal_code, phone, website, hours, price_range, amenities, is_claimed, is_listed, avg_rating, review_count, ai_summary, ai_summary_tags"
      )
      .eq("is_listed", true)
      .not("avg_rating", "is", null)
      .order("avg_rating", { ascending: false })
      .limit(limit);

    if (city) {
      query = query.ilike("city", city);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return data.map((row) => mapRow(row as Record<string, unknown>));
    }
  } catch {
    // fall through to seed data
  }

  return getSeedFeaturedBusinesses(city, limit);
}

export async function getSimilarBusinesses(
  businessType: string,
  city: string | null | undefined,
  excludeSlug: string,
  limit = 4
): Promise<PublicBusiness[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("businesses")
      .select(
        "id, slug, name, business_type, cover_photo_url, logo_url, city, avg_rating, review_count, price_range, is_listed"
      )
      .eq("is_listed", true)
      .eq("business_type", businessType)
      .neq("slug", excludeSlug)
      .limit(limit);

    if (city) {
      query = query.ilike("city", city);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((row) => mapRow(row as Record<string, unknown>));
    }
  } catch {
    // fall through
  }

  return SEED_BUSINESSES.filter(
    (b) =>
      b.business_type === businessType &&
      b.slug !== excludeSlug &&
      (!city || b.city?.toLowerCase() === city.toLowerCase())
  ).slice(0, limit);
}
