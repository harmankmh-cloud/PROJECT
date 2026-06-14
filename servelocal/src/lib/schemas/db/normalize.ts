import type { ListingTier, ServiceProvider } from "@/lib/types";
import { serviceProviderRowSchema } from "./service-provider";

export function parseServiceProvider(row: unknown): ServiceProvider | null {
  const parsed = serviceProviderRowSchema.safeParse(row);
  if (!parsed.success) return null;
  return parsed.data;
}

export function parseServiceProviders(rows: unknown[]): ServiceProvider[] {
  return rows.map(parseServiceProvider).filter((p): p is ServiceProvider => p !== null);
}

export const TIER_RANK: Record<string, number> = { premium: 0, featured: 1, free: 2 };

export function sortProviders(
  list: ServiceProvider[],
  sort: "recommended" | "rating" | "experience" | "reviews" = "recommended"
) {
  const ranked = [...list].sort((a, b) => {
    const tierDiff =
      (TIER_RANK[a.listing_tier || "free"] ?? 2) - (TIER_RANK[b.listing_tier || "free"] ?? 2);
    if (tierDiff !== 0) return tierDiff;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;

    if (sort === "rating") return (b.avg_rating || 0) - (a.avg_rating || 0);
    if (sort === "experience") return (b.years_experience || 0) - (a.years_experience || 0);
    if (sort === "reviews") return (b.review_count || 0) - (a.review_count || 0);

    const scoreA = (a.avg_rating || 0) * 10 + (a.review_count || 0) + (a.featured ? 5 : 0);
    const scoreB = (b.avg_rating || 0) * 10 + (b.review_count || 0) + (b.featured ? 5 : 0);
    if (scoreB !== scoreA) return scoreB - scoreA;
    return a.display_name.localeCompare(b.display_name);
  });
  return ranked;
}

export function isFeaturedTier(tier?: ListingTier | string | null) {
  return tier === "featured" || tier === "premium";
}
