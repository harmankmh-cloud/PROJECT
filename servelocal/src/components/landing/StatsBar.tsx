"use client";

import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FadeUp } from "@/components/motion/FadeUp";

type PlatformStats = {
  providers: number;
  verified: number;
  reviews: number;
  cities: number;
};

type StatItem = {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
};

/**
 * Build stats from live Supabase counts only. Any stat with a zero count is
 * omitted entirely so we never render a hollow "0+" claim.
 */
function buildStats(platformStats?: PlatformStats): StatItem[] {
  if (!platformStats) return [];
  const items: StatItem[] = [];
  if (platformStats.verified > 0) {
    items.push({ value: platformStats.verified, suffix: "+", label: "Verified pros" });
  }
  if (platformStats.providers > 0) {
    items.push({ value: platformStats.providers, suffix: "+", label: "Pros listed across BC" });
  }
  if (platformStats.reviews > 0) {
    items.push({ value: platformStats.reviews, suffix: "+", label: "Homeowner reviews" });
  }
  if (platformStats.cities > 0) {
    items.push({ value: platformStats.cities, suffix: "", label: "BC cities served" });
  }
  return items;
}

export function StatsBar({ platformStats }: { platformStats?: PlatformStats }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const stats = buildStats(platformStats);

  // Nothing live to show yet — render nothing rather than placeholder numbers.
  if (stats.length === 0) return null;

  return (
    <section ref={ref} className="border-y border-border bg-gradient-to-r from-amber-500/5 via-transparent to-sky-500/5 px-4 py-12 sm:px-8">
      <FadeUp>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-black text-foreground sm:text-4xl">
                {inView ? (
                  <CountUp
                    end={stat.value}
                    decimals={stat.decimals ?? 0}
                    duration={2}
                    suffix={stat.suffix}
                  />
                ) : (
                  `0${stat.suffix}`
                )}
              </p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  );
}
