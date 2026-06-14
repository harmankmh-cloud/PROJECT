"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useRef } from "react";
import type { PublicBusiness } from "@/lib/types";
import { StarDisplay } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { FadeInSection } from "@/components/ui/FadeInSection";

const PRICE_LABELS = ["", "$", "$$", "$$$", "$$$$"];

export function FeaturedBusinesses({ businesses }: { businesses: PublicBusiness[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  if (businesses.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="marketing-container">
        <FadeInSection className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl text-text md:text-3xl">Featured Businesses</h2>
            <p className="mt-2 text-muted">Top-rated local favourites across Canada</p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="rounded-full border border-border p-2 text-muted hover:border-primary hover:text-primary"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="rounded-full border border-border p-2 text-muted hover:border-primary hover:text-primary"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </FadeInSection>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {businesses.map((biz) => (
            <Link
              key={biz.slug}
              href={`/business/${biz.slug}`}
              className="card-glow group min-w-[280px] max-w-[300px] flex-shrink-0 snap-start overflow-hidden p-0"
            >
              <div className="relative h-36 overflow-hidden bg-surface">
                {biz.cover_photo_url ? (
                  <Image
                    src={biz.cover_photo_url}
                    alt={biz.name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="300px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-border/30 text-muted">
                    No photo
                  </div>
                )}
                {biz.is_open_now && (
                  <Badge className="absolute left-3 top-3 bg-success/90 text-white">
                    Open Now
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {biz.logo_url && (
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-border">
                      <Image src={biz.logo_url} alt="" fill className="object-cover" sizes="40px" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-text">{biz.name}</h3>
                    <p className="text-sm text-muted">{biz.business_type}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <StarDisplay value={biz.avg_rating ?? 0} size="sm" showValue />
                  <span className="text-sm text-muted">{biz.review_count} reviews</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                  <MapPin className="h-3 w-3" />
                  {biz.city}
                  {biz.price_range ? (
                    <span className="text-star">{PRICE_LABELS[biz.price_range]}</span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
