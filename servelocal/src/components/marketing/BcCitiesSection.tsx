import Link from "next/link";
import { BC_CITY_CHIPS } from "@/content/copy";
import { isValidCitySlug } from "@/lib/constants";

export function BcCitiesSection() {
  return (
    <section className="px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="font-label text-primary">Local coverage</p>
        <h2 className="font-display mt-2 text-3xl font-black text-slate-50">Serving these BC communities</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {BC_CITY_CHIPS.map((city) => {
            const href = isValidCitySlug(city.slug) ? `/${city.slug}` : `/search?city=${city.slug}`;
            return (
              <Link
                key={city.slug}
                href={href}
                className="rounded-full border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-primary/50 hover:text-primary"
              >
                {city.name}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
