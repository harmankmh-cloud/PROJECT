import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProviderCard } from "@/components/ProviderCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TRADE_CITIES, SERVE_LOCAL } from "@/lib/constants";
import { getApprovedProviders, getServiceCategories } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityMeta = TRADE_CITIES.find((c) => c.slug === city);
  if (!cityMeta) return { title: "City not found" };

  return {
    title: `Find Local Trades in ${cityMeta.name} | ${SERVE_LOCAL.name} BC`,
    description: `Browse plumbers, electricians, and handymen in ${cityMeta.name}, ${cityMeta.region}. Post a job or compare verified local pros on ${SERVE_LOCAL.name}.`,
    alternates: { canonical: `/${city}` },
  };
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
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <Link href="/" className="text-sm font-semibold text-teal-600 hover:underline">
          ← {SERVE_LOCAL.name}
        </Link>
        <h1 className="font-display mt-4 text-3xl text-brand-950 sm:text-4xl">
          Local trades in {cityMeta.name}
        </h1>
        <p className="mt-2 text-slate-600">
          {cityMeta.region} · Compare pros, read reviews, or post a job for free quotes.
        </p>

        <div className="mt-10">
          <h2 className="font-semibold text-brand-950">Pick a service</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/${city}/${cat.slug}`} className="chip-tag">
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {providers.length === 0 ? (
          <div className="surface-card mt-12 p-8">
            <div className="mx-auto max-w-xl text-center">
              <p className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                Directory growing in {cityMeta.name}
              </p>
              <h2 className="font-display mt-4 text-2xl text-brand-950">Need a tradie? Post your job first</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                We&apos;re adding verified pros in {cityMeta.name}. Homeowners can post a job now — local trades
                get notified as listings go live. No cost to post.
              </p>
              <Link href={`/request?city=${city}`} className="btn-gold mt-6 inline-flex px-8 py-3">
                Post a job in {cityMeta.name}
              </Link>
            </div>
            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm font-medium text-brand-950">Are you a tradie in {cityMeta.name}?</p>
              <p className="mt-1 text-sm text-slate-500">Be among the first listed — free starter plan available.</p>
              <Link href="/join" className="btn-ghost mt-4 inline-flex px-6 py-2.5 text-sm">
                List my business
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-12">
            <h2 className="font-semibold text-brand-950">Top pros in {cityMeta.name}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {providers.map((p) => {
                const cat = categories.find((c) => c.slug === p.category_slug);
                return <ProviderCard key={p.id} provider={p} categoryName={cat?.name} />;
              })}
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={`/request?city=${city}`} className="btn-gold px-6 py-3">
            Get free quotes in {cityMeta.name}
          </Link>
          <Link href="/guides" className="btn-ghost px-6 py-3">
            BC cost guides
          </Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
