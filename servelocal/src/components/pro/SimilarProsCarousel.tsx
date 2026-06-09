"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import type { ServiceCategory, ServiceProvider } from "@/lib/types";
import { cityName } from "@/lib/constants";
import { Avatar } from "@/components/ui/Avatar";
import { FadeUp } from "@/components/motion/FadeUp";

type Props = {
  providers: ServiceProvider[];
  category: ServiceCategory | null;
  citySlug: string;
};

export function SimilarProsCarousel({ providers, category, citySlug }: Props) {
  if (providers.length === 0) return null;

  return (
    <FadeUp>
      <section className="border-t border-border pt-10">
        <h2 className="font-display text-xl font-bold text-foreground">
          Similar {category?.name} pros near {cityName(citySlug)}
        </h2>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {providers.map((p) => (
            <Link
              key={p.id}
              href={`/pro/${p.slug}`}
              className="card-glow w-[240px] shrink-0 rounded-[14px] border border-border bg-surface p-4 transition hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <Avatar name={p.display_name} size="sm" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{p.display_name}</p>
                  <p className="text-xs text-muted">{cityName(p.city_slug)}</p>
                </div>
              </div>
              {(p.avg_rating ?? 0) > 0 && (
                <div className="mt-3 flex items-center gap-1 text-sm text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {p.avg_rating}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>
    </FadeUp>
  );
}
