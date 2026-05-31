import Link from "next/link";
import { notFound } from "next/navigation";
import { ProviderCard } from "@/components/tradelocal/ProviderCard";
import { TRADE_CITIES, TRADE_LOCAL, cityName } from "@/lib/tradelocal/constants";
import { getApprovedProviders, getServiceCategories } from "@/lib/tradelocal/data";

export default async function TradeCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const cityMeta = TRADE_CITIES.find((c) => c.slug === city);
  if (!cityMeta) notFound();

  const [categories, providers] = await Promise.all([
    getServiceCategories(),
    getApprovedProviders({ citySlug: city }),
  ]);

  return (
    <main className="mesh-bg min-h-screen">
      <header className="site-header px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Link href="/trade" className="text-sm font-semibold text-teal-600 hover:underline">
            ← {TRADE_LOCAL.name}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <h1 className="font-display text-3xl text-brand-950 sm:text-4xl">{cityMeta.name}</h1>
        <p className="mt-2 text-slate-600">Local trades & services — contact them directly.</p>

        <div className="mt-10">
          <h2 className="font-semibold text-brand-950">Pick a service</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/trade/${city}/${cat.slug}`} className="chip-tag">
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {providers.length > 0 && (
          <div className="mt-12">
            <h2 className="font-semibold text-brand-950">All listings in {cityMeta.name}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {providers.map((p) => {
                const cat = categories.find((c) => c.slug === p.category_slug);
                return <ProviderCard key={p.id} provider={p} categoryName={cat?.name} />;
              })}
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={`/trade/request?city=${city}`} className="btn-gold px-6 py-3">
            Post a job in {cityMeta.name}
          </Link>
          <Link href="/trade/join" className="btn-ghost px-6 py-3">
            Get listed here
          </Link>
        </div>
      </div>
    </main>
  );
}
