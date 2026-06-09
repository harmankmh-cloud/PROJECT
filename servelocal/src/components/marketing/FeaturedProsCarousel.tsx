import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";
import type { ServiceProvider } from "@/lib/types";
import { cityName } from "@/lib/constants";

type Props = {
  providers: ServiceProvider[];
  categories: { slug: string; name: string }[];
};

export function FeaturedProsCarousel({ providers, categories }: Props) {
  if (providers.length === 0) return null;

  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <section className="border-t border-slate-700/80 px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-label text-primary">Top rated</p>
        <h2 className="font-display mt-2 text-3xl font-black text-slate-50 sm:text-4xl">
          Top Rated Pros Near You
        </h2>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {providers.slice(0, 8).map((p) => (
            <article
              key={p.id}
              className="card-dark-hover pro-card-accent w-[280px] shrink-0"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-lg font-bold text-primary">
                  {p.display_name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-50">{p.display_name}</h3>
                  <p className="text-xs text-slate-400">
                    {catName(p.category_slug)} · {cityName(p.city_slug)}
                  </p>
                </div>
              </div>
              {(p.avg_rating ?? 0) > 0 && (
                <div className="mt-3 flex items-center gap-1.5 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-amber-400">{p.avg_rating}</span>
                  <span className="text-slate-500">({p.review_count ?? 0} reviews)</span>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {p.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Available
                </span>
              </div>
              <Link
                href={`/pro/${p.slug}`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
              >
                View Profile
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
