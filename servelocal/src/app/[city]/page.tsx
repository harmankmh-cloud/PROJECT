import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProviderCard } from "@/components/ProviderCard";
import { ProvidersMapSection } from "@/components/ProvidersMapSection";
import { EmptyDirectoryState } from "@/components/search/EmptyDirectoryState";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { TRADE_CITIES, SERVE_LOCAL } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { getApprovedProviders, getServiceCategories } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityMeta = TRADE_CITIES.find((c) => c.slug === city);
  if (!cityMeta) return { title: "City not found" };

  return pageMetadata({
    title: `Local Trades in ${cityMeta.name} BC`,
    description: `Browse plumbers, electricians, and handymen in ${cityMeta.name}, ${cityMeta.region}. Post a job or compare verified local pros on ${SERVE_LOCAL.name}.`,
    path: `/${city}`,
  });
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const cityMeta = TRADE_CITIES.find((c) => c.slug === city);
  if (!cityMeta) notFound();

  const [categories, providers] = await Promise.all([
    getServiceCategories(),
    getApprovedProviders({ citySlug: city, sort: "recommended" }),
  ]);

  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <Link href="/" className="text-sm font-semibold text-primary hover:underline">
          ← {SERVE_LOCAL.name}
        </Link>
        <h1 className="font-display mt-4 text-3xl font-black text-foreground sm:text-4xl">
          Local trades in {cityMeta.name}
        </h1>
        <p className="mt-2 text-muted">
          {cityMeta.region} · Compare pros, read reviews, or post a job for free quotes.
        </p>

        <div className="mt-10">
          <h2 className="font-semibold text-foreground">Pick a service</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/${city}/${cat.slug}`} className="chip-tag">
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {providers.length === 0 ? (
          <div className="mt-12">
            <EmptyDirectoryState citySlug={city} />
          </div>
        ) : (
          <>
            <div className="mt-12">
              <h2 className="font-semibold text-foreground">Top pros in {cityMeta.name}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {providers.map((p) => {
                  const cat = categories.find((c) => c.slug === p.category_slug);
                  return <ProviderCard key={p.id} provider={p} categoryName={cat?.name} />;
                })}
              </div>
            </div>
            <ProvidersMapSection citySlug={city} />
          </>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <ShimmerButton href={`/request?city=${city}`}>Get free quotes in {cityMeta.name}</ShimmerButton>
          <Link
            href="/guides"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-amber-400/50"
          >
            BC cost guides
          </Link>
        </div>
      </div>
    </MarketingPageShell>
  );
}
