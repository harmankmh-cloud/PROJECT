import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ProviderCard } from "@/components/ProviderCard";
import { SearchBar } from "@/components/SearchBar";
import { TRADE_CITIES } from "@/lib/constants";
import { POPULAR_SEARCHES } from "@/lib/marketing-content";
import { getApprovedProviders, getServiceCategories, searchProviders } from "@/lib/data";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const [results, categories, featured] = await Promise.all([
    query ? searchProviders(query) : Promise.resolve([]),
    getServiceCategories(),
    query ? Promise.resolve([]) : getApprovedProviders({ sort: "recommended" }),
  ]);

  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-brand-950">Search local pros</h1>
        <p className="mt-2 text-slate-600">Browse categories, popular searches, or find a business by name.</p>
        <div className="mt-6 max-w-xl">
          <SearchBar defaultValue={query} />
        </div>

        {!query && (
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
                    href={`/search?q=${encodeURIComponent(cat.name)}`}
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
              <div className="mt-12">
                <h2 className="font-semibold text-brand-950">Featured pros</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.slice(0, 6).map((p) => (
                    <ProviderCard key={p.id} provider={p} />
                  ))}
                </div>
              </div>
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

        {query && (
          <>
            <p className="mt-8 text-sm text-slate-500">
              {results.length} result{results.length === 1 ? "" : "s"} for &quot;{query}&quot;
            </p>
            {results.length === 0 ? (
              <div className="surface-card mt-6 p-8 text-center">
                <p className="font-medium text-brand-950">No matches yet</p>
                <p className="mt-2 text-sm text-slate-600">
                  Post your job — we&apos;ll notify local pros as the directory grows.
                </p>
                <Link href="/request" className="btn-gold mt-4 inline-flex px-6 py-3">
                  Post a job
                </Link>
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
