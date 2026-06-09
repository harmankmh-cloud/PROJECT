import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { ProListingCard } from "@/components/search/ProListingCard";
import { SearchSplitView } from "@/components/search/SearchSplitView";
import { FadeUp } from "@/components/motion/FadeUp";
import { SERVE_LOCAL, cityName } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { getApprovedProviders, getCategoryBySlug, getServiceCategories } from "@/lib/data";
import type { ProviderSort } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return { title: "Category not found" };

  return pageMetadata({
    title: `${cat.name} Services in Canada`,
    description: `Find verified ${cat.name.toLowerCase()} pros across Canada. Compare ratings, prices, and book on ${SERVE_LOCAL.name}.`,
    path: `/services/${category}`,
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

  const [providers, categories] = await Promise.all([
    getApprovedProviders({
      categorySlug: category,
      citySlug: filters.city || undefined,
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

  return (
    <MarketingPageShell>
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-amber-500/10 via-background to-sky-500/5 px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeUp>
            <p className="font-label text-primary">{cat.icon} {cat.name}</p>
            <h1 className="font-display mt-2 text-4xl font-black text-foreground sm:text-5xl">
              {cat.name} Pros Near You
            </h1>
            <p className="mt-3 text-muted">
              {filtered.length} verified pros available · Avg price: {avgPrice}
              {filters.city && ` in ${cityName(filters.city)}`}
            </p>
          </FadeUp>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-[14px] bg-surface" />}>
            <FilterSidebar categories={categories} showCategory={false} basePath={`/services/${category}`} />
          </Suspense>

          <div>
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

            {filters.view === "map" || filters.view === "split" ? (
              <SearchSplitView
                providers={filtered}
                categoryNames={categoryNames}
                citySlug={city}
              />
            ) : (
              <div className="space-y-4">
                {filtered.length === 0 ? (
                  <div className="rounded-[14px] border border-dashed border-border p-8 text-center">
                    <p className="font-medium text-foreground">No pros match your filters</p>
                    <Link href={`/request?category=${category}`} className="mt-4 inline-block text-primary hover:underline">
                      Post a job to get matched →
                    </Link>
                  </div>
                ) : (
                  filtered.map((p, i) => (
                    <ProListingCard
                      key={p.id}
                      provider={p}
                      categoryName={cat.name}
                      distance={`In ${cityName(p.city_slug)}`}
                      sponsored={i === 0 && p.featured}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
