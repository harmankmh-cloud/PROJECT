import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ProviderCard } from "@/components/ProviderCard";
import { SearchBarWithSuggest } from "@/components/SearchBarWithSuggest";
import { SearchFiltersWithDefaults } from "@/components/SearchFilters";
import { ProvidersMapSection } from "@/components/ProvidersMapSection";
import { TRADE_CITIES } from "@/lib/constants";
import { POPULAR_SEARCHES } from "@/lib/marketing-content";
import { pageMetadata } from "@/lib/seo";
import { getApprovedProviders, getServiceCategories, searchProviders } from "@/lib/data";

type SearchParams = {
  q?: string;
  city?: string;
  category?: string;
  licensed?: string;
  verified?: string;
  emergency?: string;
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
      description: `Find local ${query} pros in British Columbia. Browse verified trades and contact them direct on ServeLocal.`,
      path: `/search?q=${encodeURIComponent(query)}`,
    });
  }

  if (params.emergency === "1") {
    return pageMetadata({
      title: "24/7 Emergency Trades in BC",
      description: "Find emergency plumbers, HVAC, and electricians available now in Fraser Valley and Metro Vancouver.",
      path: "/search?emergency=1",
    });
  }

  return pageMetadata({
    title: "Search Local Pros in BC",
    description:
      "Search plumbers, electricians, handymen, and more across Fraser Valley and Metro Vancouver. Call pros direct — no middleman fees.",
    path: "/search",
  });
}

async function getFilteredResults(params: SearchParams) {
  const hasFilters =
    params.city ||
    params.category ||
    params.licensed === "1" ||
    params.verified === "1" ||
    params.emergency === "1";

  if (hasFilters || params.q?.trim()) {
    return getApprovedProviders({
      query: params.q?.trim(),
      citySlug: params.city,
      categorySlug: params.category,
      licensedOnly: params.licensed === "1",
      verifiedOnly: params.verified === "1",
      emergencyOnly: params.emergency === "1",
      sort: "recommended",
    });
  }

  return [];
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const hasActiveSearch =
    Boolean(query) ||
    Boolean(params.city) ||
    Boolean(params.category) ||
    params.licensed === "1" ||
    params.verified === "1" ||
    params.emergency === "1";

  const [results, categories, featured] = await Promise.all([
    hasActiveSearch ? getFilteredResults(params) : Promise.resolve([]),
    getServiceCategories(),
    hasActiveSearch ? Promise.resolve([]) : getApprovedProviders({ sort: "recommended" }),
  ]);

  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-brand-950">Search local pros</h1>
        <p className="mt-2 text-slate-600">Browse categories, filter by city, or find a business by name.</p>
        <div className="mt-6 max-w-xl">
          <SearchBarWithSuggest defaultValue={query} />
        </div>

        <Suspense fallback={null}>
          <SearchFiltersWithDefaults />
        </Suspense>

        {!hasActiveSearch && (
          <>
            <div className="mt-10">
              <h2 className="font-semibold text-brand-950">Popular searches</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <Link key={item.href} href={item.href} className="chip-tag">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-semibold text-brand-950">Browse by service</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/search?category=${cat.slug}`}
                    className="surface-card flex items-center gap-3 p-4 transition hover:border-teal-400/30"
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="font-medium text-brand-950">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-semibold text-brand-950">Browse by city</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {TRADE_CITIES.map((city) => (
                  <Link key={city.slug} href={`/${city.slug}`} className="surface-card-hover p-4">
                    <p className="font-semibold text-brand-950">{city.name}</p>
                    <p className="text-xs text-slate-500">{city.region}</p>
                  </Link>
                ))}
              </div>
            </div>

            {featured.length > 0 ? (
              <>
                <ProvidersMapSection />
              </>
            ) : (
              <div className="surface-card mt-12 p-8 text-center">
                <p className="font-medium text-brand-950">No listings yet — post a job to get started</p>
                <p className="mt-2 text-sm text-slate-600">
                  Tell us what you need and we&apos;ll match you as pros join your area.
                </p>
                <Link href="/request" className="btn-gold mt-4 inline-flex px-6 py-3">
                  Post a job
                </Link>
              </div>
            )}
          </>
        )}

        {hasActiveSearch && (
          <>
            <p className="mt-8 text-sm text-slate-500">
              {results.length} result{results.length === 1 ? "" : "s"}
              {query && <> for &quot;{query}&quot;</>}
              {params.emergency === "1" && " · 24/7 emergency"}
            </p>
            {results.length === 0 ? (
              <div className="surface-card mt-6 p-8">
                <div className="mx-auto max-w-lg text-center">
                  <p className="font-medium text-brand-950">No matches yet</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Post your job and browse nearby areas while the directory grows.
                  </p>
                  <Link href="/request" className="btn-gold mt-4 inline-flex px-6 py-3">
                    Post a job
                  </Link>
                </div>
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <p className="text-sm font-semibold text-brand-950">Try these instead</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((item) => (
                      <Link key={item.href} href={item.href} className="chip-tag">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <p className="mt-6 text-sm font-semibold text-brand-950">Browse by city</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {TRADE_CITIES.map((city) => (
                      <Link key={city.slug} href={`/${city.slug}`} className="chip-tag">
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((p) => (
                  <ProviderCard key={p.id} provider={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
