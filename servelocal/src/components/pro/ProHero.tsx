"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BadgeCheck, Clock, MapPin, Star } from "lucide-react";
import type { ServiceCategory, ServiceProvider } from "@/lib/types";
import { cityName } from "@/lib/constants";
import { getCategoryIcon } from "@/lib/category-icons";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

type Props = {
  provider: ServiceProvider;
  category: ServiceCategory | null;
  cityCategoryHref: string;
};

export function ProHero({ provider, category, cityCategoryHref }: Props) {
  const [showSticky, setShowSticky] = useState(false);
  const Icon = getCategoryIcon(provider.category_slug);
  const isTopPro = provider.listing_tier === "premium" || provider.featured;

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <section className="relative border-b border-border">
        <div className="h-48 bg-gradient-to-br from-amber-500/20 via-sky-500/10 to-background sm:h-56" />
        <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-8">
          <Link
            href={cityCategoryHref}
            className="inline-flex text-sm font-medium text-muted transition hover:text-primary"
          >
            ← {category?.name} in {cityName(provider.city_slug)}
          </Link>

          <div className="-mt-16 flex flex-col gap-6 sm:flex-row sm:items-end">
            <Avatar name={provider.display_name} size="xl" className="ring-4 ring-background" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {provider.verified && (
                  <Badge variant="success">
                    <BadgeCheck className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                )}
                {isTopPro && (
                  <span className="inline-flex items-center rounded-full bg-amber-400/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Top Pro
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-sm text-success">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Available for new work
                </span>
              </div>
              <h1 className="font-display mt-3 text-3xl font-black text-foreground sm:text-4xl">
                {provider.display_name}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-muted">
                <Icon className="h-4 w-4 text-primary" />
                {category?.name}
                <span>·</span>
                <MapPin className="h-3.5 w-3.5" />
                {cityName(provider.city_slug)}, BC
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                {(provider.avg_rating ?? 0) > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-foreground">{provider.avg_rating}</span>
                    <span className="text-sm text-muted">({provider.review_count ?? 0} reviews)</span>
                  </div>
                )}
                {provider.response_time && (
                  <span className="inline-flex items-center gap-1 text-sm text-muted">
                    <Clock className="h-3.5 w-3.5" />
                    Responds {provider.response_time}
                  </span>
                )}
              </div>
            </div>
            <div className="hidden sm:block">
              <ShimmerButton size="lg" onClick={() => document.getElementById("request-quote")?.scrollIntoView({ behavior: "smooth" })}>
                Get a Quote
              </ShimmerButton>
            </div>
          </div>
        </div>
      </section>

      {showSticky && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur-xl sm:hidden">
          <ShimmerButton
            className="w-full"
            onClick={() => document.getElementById("request-quote")?.scrollIntoView({ behavior: "smooth" })}
          >
            Get a Quote
          </ShimmerButton>
        </div>
      )}
    </>
  );
}
