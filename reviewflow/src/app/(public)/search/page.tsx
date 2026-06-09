import type { Metadata } from "next";
import { Suspense } from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { SearchPageClient } from "@/components/search/SearchPageClient";
import { searchBusinesses } from "@/lib/search-businesses";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Search",
  description: "Search businesses, services, and locations across Canada.",
};

type Props = { searchParams: Promise<Record<string, string | undefined>> };

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const { businesses, total } = await searchBusinesses({
    q: params.q,
    city: params.city,
    category: params.category,
    openNow: params.openNow === "true",
    minRating: params.minRating ? Number(params.minRating) : undefined,
    hasPhotos: params.hasPhotos === "true",
    sort: (params.sort as "match" | "rating" | "reviews" | "closest") ?? "match",
    page: 1,
    limit: 10,
  });

  return (
    <main>
      <LandingNavbar />
      <Suspense
        fallback={
          <div className="marketing-container space-y-4 py-8">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        }
      >
        <SearchPageClient initialBusinesses={businesses} initialTotal={total} />
      </Suspense>
      <LandingFooter />
    </main>
  );
}
