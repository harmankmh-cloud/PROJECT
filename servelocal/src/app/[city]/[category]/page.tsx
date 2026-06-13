import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CategoryFilters } from "@/components/CategoryFilters";
import { ProviderCard } from "@/components/ProviderCard";
import { ProvidersMapSection } from "@/components/ProvidersMapSection";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { EmptyDirectoryState } from "@/components/search/EmptyDirectoryState";
import { TRADE_CITIES, SERVE_LOCAL, cityName, SERVICE_SUBCATEGORIES } from "@/lib/constants";
import { pageMetadata, tradeListingTitle } from "@/lib/seo";
import { getApprovedProviders, getCategoryBySlug } from "@/lib/data";
import type { ProviderSort } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; category: string }>;
}): Promise<Metadata> {
  const { city, category } = await params;
  const cityMeta = TRADE_CITIES.find((c) => c.slug === city);
  const cat = await getCategoryBySlug(category);
  if (!cityMeta || !cat) return { title: "Not found" };

  return pageMetadata({
    title: tradeListingTitle({ trade: cat.name, citySlug: city }),
    description: `Find ${cat.name.toLowerCase()} pros in ${cityMeta.name}, ${cityMeta.region}. Compare verified listings, reviews, and contact trades direct on ${SERVE_LOCAL.name}.`,
    path: `/${city}/${category}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ city: string; category: string }>;
  searchParams: Promise<{ licensed?: string; verified?: string; emergency?: string; sort?: string }>;
}) {
  const { city, category } = await params;
  const filters = await searchParams;
  if (!TRADE_CITIES.some((c) => c.slug === city)) notFound();

  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();

  const sort = (filters.sort as ProviderSort) || "recommended";
  const providers = await getApprovedProviders({
    citySlug: city,
    categorySlug: category,
    licensedOnly: filters.licensed === "1",
    verifiedOnly: filters.verified === "1",
    emergencyOnly: filters.emergency === "1",
    sort,
  });

  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <Link href={`/${city}`} className="text-sm font-semibold text-primary hover:underline">
          ← {cityName(city)}
        </Link>
        <p className="font-label mt-4 text-primary">{SERVE_LOCAL.name}</p>
        <h1 className="font-display mt-2 text-3xl font-black text-foreground sm:text-4xl">
          {cat.icon} {cat.name} in {cityName(city)}
        </h1>
        <p className="mt-2 text-muted">
          {providers.length > 0
            ? `${providers.length} listing${providers.length === 1 ? "" : "s"} — verified badges, reviews & direct contact.`
            : `Growing our ${cat.name.toLowerCase()} network in ${cityName(city)} — post a job for free matching.`}
        </p>

        <Suspense fallback={null}>
          <CategoryFilters />
        </Suspense>

        {SERVICE_SUBCATEGORIES[category] && (
          <div className="mt-4 flex flex-wrap gap-2">
            {SERVICE_SUBCATEGORIES[category].map((sub) => (
              <Link
                key={sub.slug}
                href={`/${city}/${category}?q=${encodeURIComponent(sub.label)}`}
                className="chip-tag text-xs"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        )}

        {!providers.length ? (
          <div className="mt-10">
            <EmptyDirectoryState
            citySlug={city}
            categorySlug={category}
            categoryName={cat.name}
            reason={
              filters.licensed === "1" || filters.verified === "1" || filters.emergency === "1"
                ? "filtered-out"
                : "zero-pros"
            }
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} categoryName={cat.name} />
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-muted">
          {SERVE_LOCAL.name} provides contacts only. Verify license &amp; insurance before hiring.
        </p>
      </div>
    </MarketingPageShell>
  );
}
