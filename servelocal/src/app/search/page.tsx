import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { SearchSplitView } from "@/components/search/SearchSplitView";
import { FadeUp } from "@/components/motion/FadeUp";
import { SearchBarWithSuggest } from "@/components/SearchBarWithSuggest";
import { POPULAR_SEARCHES } from "@/lib/marketing-content";
import { TRADE_CITIES } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { getApprovedProviders, getServiceCategories } from "@/lib/data";

type SearchParams = {
  q?: string;
  city?: string;
  category?: string;
  licensed?: string;
  verified?: string;
  emergency?: string;
  minRating?: string;
  fastResponse?: string;
  instantBook?: string;
  sort?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q?.trim();
  if (query) {
    return pageMetadata({
      title: `Search: ${query}`,
      description: `Find local ${query} pros in Canada. Browse verified contractors on ServeLocal.`,
      path: `/search?q=${encodeURIComponent(query)}`,
    });
  }
  return pageMetadata({
    title: "Search Local Pros in Canada",
    description: "Search plumbers, electricians, cleaners, and more. Split map view with instant filters.",
    path: "/search",
  });
}

async function getFilteredResults(params: SearchParams) {
  const hasFilters =
    params.city ||
    params.category ||
    params.licensed === "1" ||
    params.verified === "1" ||
    params.emergency === "1" ||
    params.q?.trim();

  if (!hasFilters) return [];

  let results = await getApprovedProviders({
    query: params.q?.trim(),
    citySlug: params.city,
    categorySlug: params.category,
    licensedOnly: params.licensed === "1",
    verifiedOnly: params.verified === "1",
    emergencyOnly: params.emergency === "1",
    sort: (params.sort as "recommended") || "recommended",
  });

  if (params.minRating) {
    const min = parseFloat(params.minRating);
    results = results.filter((p) => (p.avg_rating ?? 0) >= min);
  }
  if (params.fastResponse === "1") {
    results = results.filter((p) => p.response_time?.includes("hour"));
  }
  if (params.instantBook === "1") {
    results = results.filter((p) => p.listing_tier === "premium" || p.featured);
  }

  return results;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const hasActiveSearch = Boolean(
    query || params.city || params.category || params.licensed === "1" ||
    params.verified === "1" || params.emergency === "1"
  );

  const [results, categories] = await Promise.all([
    hasActiveSearch ? getFilteredResults(params) : Promise.resolve([]),
    getServiceCategories(),
  ]);

  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

  return (
    <MarketingPageShell>
      <div className="border-b border-border px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeUp>
            <h1 className="font-display text-3xl font-black text-foreground sm:text-4xl">
              Find Local Pros
            </h1>
            <p className="mt-2 text-muted">Search by service, city, or pro name</p>
            <div className="mt-6 max-w-2xl">
              <SearchBarWithSuggest defaultValue={query} />
            </div>
          </FadeUp>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        {!hasActiveSearch ? (
          <FadeUp>
            <h2 className="font-semibold text-foreground">Popular searches</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted transition hover:border-amber-400/50 hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <h2 className="mt-10 font-semibold text-foreground">Browse by service</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/services/${cat.slug}`}
                  className="card-glow flex items-center gap-3 rounded-[14px] border border-border bg-surface p-4 transition hover:-translate-y-0.5"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-medium text-foreground">{cat.name}</span>
                </Link>
              ))}
            </div>
            <h2 className="mt-10 font-semibold text-foreground">Browse by city</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {TRADE_CITIES.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}`}
                  className="card-glow rounded-[14px] border border-border bg-surface p-4 transition hover:-translate-y-0.5"
                >
                  <p className="font-semibold text-foreground">{city.name}</p>
                  <p className="text-xs text-muted">{city.region}</p>
                </Link>
              ))}
            </div>
          </FadeUp>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-[14px] bg-surface" />}>
              <FilterSidebar categories={categories} />
            </Suspense>
            <div>
              <p className="mb-4 text-sm text-muted">
                {results.length} result{results.length === 1 ? "" : "s"}
                {query && <> for &quot;{query}&quot;</>}
              </p>
              <SearchSplitView
                providers={results}
                categoryNames={categoryNames}
                citySlug={params.city}
                query={query}
              />
            </div>
          </div>
        )}
      </div>
    </MarketingPageShell>
  );
}
