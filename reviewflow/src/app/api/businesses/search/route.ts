import { NextResponse } from "next/server";
import { searchBusinesses, type SearchFilters } from "@/lib/search-businesses";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filters: SearchFilters = {
    q: searchParams.get("q") ?? undefined,
    city: searchParams.get("city") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    openNow: searchParams.get("openNow") === "true",
    minRating: searchParams.get("minRating")
      ? Number(searchParams.get("minRating"))
      : undefined,
    hasPhotos: searchParams.get("hasPhotos") === "true",
    sort: (searchParams.get("sort") as SearchFilters["sort"]) ?? "match",
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
  };

  const priceRange = searchParams.get("priceRange");
  if (priceRange) {
    filters.priceRange = priceRange.split(",").map(Number).filter(Boolean);
  }

  const result = await searchBusinesses(filters);
  return NextResponse.json(result);
}
