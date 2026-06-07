import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CategoryFilters } from "@/components/CategoryFilters";
import { ProviderCard } from "@/components/ProviderCard";
import { ProvidersMapSection } from "@/components/ProvidersMapSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TRADE_CITIES, SERVE_LOCAL, cityName, SERVICE_SUBCATEGORIES } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
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
    title: `${cat.name} in ${cityMeta.name} BC`,
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
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <Link href={`/${city}`} className="text-sm font-semibold text-teal-600 hover:underline">
          ← {cityName(city)}
        </Link>
        <p className="section-eyebrow mt-4">{SERVE_LOCAL.name}</p>
        <h1 className="font-display mt-2 text-3xl text-brand-950 sm:text-4xl">
          {cat.icon} {cat.name} in {cityName(city)}
        </h1>
        <p className="mt-2 text-slate-600">
          {providers.length} listing{providers.length === 1 ? "" : "s"} — verified badges, reviews & direct contact.
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

        {providers.length === 0 ? (
          <div className="surface-card mt-10 p-8 text-center">
            <p className="font-medium text-brand-950">No listings match your filters.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/join" className="btn-gold px-6 py-3">List my business</Link>
              <Link href={`/request?city=${city}&category=${category}`} className="btn-ghost px-6 py-3">Post a job</Link>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} categoryName={cat.name} />
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-slate-500">
          {SERVE_LOCAL.name} provides contacts only. Verify license & insurance before hiring.
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
