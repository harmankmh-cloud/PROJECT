"use client";

import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { LANDING_STATS } from "@/lib/marketing-content";
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

function buildStats(platformStats?: PlatformStats): StatItem[] {
  if (!platformStats || platformStats.providers < 5) {
    return [
      { value: platformStats?.providers ?? 0, suffix: "+", label: "Pros listed across BC" },
      { value: platformStats?.cities ?? 12, suffix: "", label: "Cities we're growing in" },
      { value: 4.8, suffix: "★", label: "Target pro rating", decimals: 1 },
      { value: 24, suffix: "hr", label: "Manual match window" },
    ];
  }

  return [
    { value: platformStats.providers, suffix: "+", label: "Verified Pros" },
    { value: platformStats.verified, suffix: "+", label: "Credential-reviewed" },
    {
      value: platformStats.reviews > 0 ? 4.8 : 4.5,
      suffix: "★",
      label: "Average Rating",
      decimals: 1,
    },
    { value: 24, suffix: "hr", label: "Avg match response" },
  ];
}

export function StatsBar({ platformStats }: { platformStats?: PlatformStats }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const stats = buildStats(platformStats);

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
