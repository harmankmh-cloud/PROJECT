import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { ProListingCard } from "@/components/search/ProListingCard";
import { SearchSplitView } from "@/components/search/SearchSplitView";
import { EmptyDirectoryState } from "@/components/search/EmptyDirectoryState";
import { FadeUp } from "@/components/motion/FadeUp";
import { SERVE_LOCAL, cityName } from "@/lib/constants";
import { pageMetadata, tradeListingTitle } from "@/lib/seo";
import { getApprovedProvidersWithFallback, getCategoryBySlug, getServiceCategories } from "@/lib/data";
import type { ProviderSort } from "@/lib/types";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ city?: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const { city } = await searchParams;
  const cat = await getCategoryBySlug(category);
  if (!cat) return { title: "Category not found" };

  return pageMetadata({
    title: tradeListingTitle({ trade: cat.name, citySlug: city ?? "surrey" }),
    description: `Find verified ${cat.name.toLowerCase()} pros in ${cityName(city ?? "surrey")}, BC. Compare ratings, prices, and get free quotes on ${SERVE_LOCAL.name}.`,
    path: city ? `/services/${category}?city=${city}` : `/services/${category}`,
  });
}

export default async function ServiceCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    city?: string;
    licensed?: string;
    verified?: string;
    sort?: string;
    minRating?: string;
    fastResponse?: string;
    view?: string;
  }>;
}) {
  const { category } = await params;
  const filters = await searchParams;
  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();

  const city = filters.city ?? "surrey";
  const sort = (filters.sort as ProviderSort) || "recommended";
  const hasActiveFilters =
    filters.licensed === "1" ||
    filters.verified === "1" ||
    Boolean(filters.minRating) ||
    filters.fastResponse === "1";

  const [{ providers, fallbackProviders }, categories] = await Promise.all([
    getApprovedProvidersWithFallback({
      categorySlug: category,
      citySlug: city,
      licensedOnly: filters.licensed === "1",
      verifiedOnly: filters.verified === "1",
      sort,
    }),
    getServiceCategories(),
  ]);

  let filtered = providers;
  if (filters.minRating) {
    const min = parseFloat(filters.minRating);
    filtered = filtered.filter((p) => (p.avg_rating ?? 0) >= min);
  }
  if (filters.fastResponse === "1") {
    filtered = filtered.filter((p) => p.response_time?.includes("hour"));
  }

  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
  const avgPrice = providers.find((p) => p.min_callout_fee)?.min_callout_fee ?? "$75–$150/hr typical";
  const isEmpty = filtered.length === 0;

  return (
    <MarketingPageShell>
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-amber-500/10 via-background to-sky-500/5 px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeUp>
            <p className="font-label text-primary">{cat.icon} {cat.name}</p>
            <h1 className="font-display mt-2 text-4xl font-black text-foreground sm:text-5xl">
              {cat.name} Pros Near You
            </h1>
            {!isEmpty ? (
              <p className="mt-3 text-muted">
                {filtered.length} verified pro{filtered.length === 1 ? "" : "s"} available · Avg price: {avgPrice}
                {` in ${cityName(city)}`}
              </p>
            ) : (
              <p className="mt-3 text-muted">
                Growing our {cat.name.toLowerCase()} network in {cityName(city)} · Post a job for free matching
              </p>
            )}
          </FadeUp>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-[14px] bg-surface" />}>
            <FilterSidebar categories={categories} showCategory={false} basePath={`/services/${category}`} />
          </Suspense>

          <div>
            {!isEmpty && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-muted">
                  Showing {filtered.length} pro{filtered.length === 1 ? "" : "s"}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/services/${category}?${new URLSearchParams({ ...filters, view: "list" } as Record<string, string>).toString()}`}
                    className="text-sm font-medium text-muted hover:text-primary"
                  >
                    List
                  </Link>
                  <span className="text-muted">|</span>
                  <Link
                    href={`/services/${category}?${new URLSearchParams({ ...filters, view: "map" } as Record<string, string>).toString()}`}
                    className="text-sm font-medium text-muted hover:text-primary"
                  >
                    Map
                  </Link>
                </div>
              </div>
            )}

            {filters.view === "map" || filters.view === "split" ? (
              <SearchSplitView
                providers={filtered}
                categoryNames={categoryNames}
                citySlug={city}
                categorySlug={category}
                fallbackProviders={fallbackProviders}
                hasActiveFilters={hasActiveFilters}
              />
            ) : isEmpty ? (
              <EmptyDirectoryState
                citySlug={city}
                categorySlug={category}
                categoryName={cat.name}
                reason={hasActiveFilters ? "filtered-out" : "zero-pros"}
              />
            ) : (
              <div className="space-y-4">
                {filtered.map((p, i) => (
                  <ProListingCard
                    key={p.id}
                    provider={p}
                    categoryName={cat.name}
                    distance={`In ${cityName(p.city_slug)}`}
                    sponsored={i === 0 && p.featured}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
