"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, Clock, Star } from "lucide-react";
import type { ServiceProvider } from "@/lib/types";
import { cityName } from "@/lib/constants";
import { Avatar } from "@/components/ui/Avatar";
import { FadeUp } from "@/components/motion/FadeUp";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

type Props = {
  providers: ServiceProvider[];
  categories: { slug: string; name: string }[];
};

export function FeaturedProsCarousel({ providers, categories }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (providers.length === 0) return null;

  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -300 : 300;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section className="border-t border-border px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeUp className="flex items-end justify-between gap-4">
          <div>
            <p className="font-label text-primary">Top rated</p>
            <h2 className="font-display mt-2 text-3xl font-black text-foreground sm:text-4xl">
              Top-Rated Pros Near You
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:border-amber-400/50"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:border-amber-400/50"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </FadeUp>

        <div
          ref={scrollRef}
          className="mt-8 flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {providers.slice(0, 8).map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-glow w-[300px] shrink-0 rounded-[14px] border border-border bg-surface p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <Avatar name={p.display_name} size="md" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-foreground">{p.display_name}</h3>
                  <p className="text-xs text-muted">
                    {catName(p.category_slug)} · {cityName(p.city_slug)}
                  </p>
                </div>
              </div>

              {(p.avg_rating ?? 0) > 0 && (
                <div className="mt-3 flex items-center gap-1.5 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-amber-500">{p.avg_rating}</span>
                  <span className="text-muted">({p.review_count ?? 0} reviews)</span>
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {p.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
                {p.response_time && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <Clock className="h-3 w-3" />
                    {p.response_time}
                  </span>
                )}
              </div>

              {p.min_callout_fee && (
                <p className="mt-3 text-sm font-semibold text-foreground">
                  From {p.min_callout_fee}
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/pro/${p.slug}`}
                  className="flex-1 rounded-full border border-border py-2 text-center text-sm font-semibold text-foreground transition hover:border-amber-400/50"
                >
                  View Profile
                </Link>
                <ShimmerButton href={`/request?pro=${p.slug}`} size="sm" className="flex-1 w-full">
                  Book Now
                </ShimmerButton>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
