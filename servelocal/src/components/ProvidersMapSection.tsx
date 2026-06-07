import Link from "next/link";
import { ProviderCard } from "@/components/ProviderCard";
import { TRADE_CITIES } from "@/lib/constants";
import { getApprovedProviders } from "@/lib/data";

export async function ProvidersMapSection({ citySlug }: { citySlug?: string }) {
  const providers = await getApprovedProviders({
    citySlug,
    sort: "recommended",
  });

  const withCoords = providers.slice(0, 12);
  if (withCoords.length === 0) return null;

  const city = citySlug ? TRADE_CITIES.find((c) => c.slug === citySlug) : null;
  const mapQuery = encodeURIComponent(
    city ? `${city.name}, BC, Canada` : "Fraser Valley, BC, Canada"
  );

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-brand-950">Pros near you</h2>
          <p className="mt-1 text-sm text-slate-500">
            {city ? `Listings in ${city.name}` : "Featured listings across BC"} — open in Google Maps
          </p>
        </div>
        <a
          href={`https://www.google.com/maps/search/local+trades/@49.1,-122.8,10z/data=!3m1!4b1?q=${mapQuery}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-teal-600 hover:underline"
        >
          Open map ↗
        </a>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
        <iframe
          title={city ? `Map of trades in ${city.name}` : "Map of BC trades"}
          src={`https://maps.google.com/maps?q=${mapQuery}&z=11&output=embed`}
          className="h-64 w-full border-0 sm:h-80"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {withCoords.map((p) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>
    </section>
  );
}
