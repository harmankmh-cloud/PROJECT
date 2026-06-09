"use client";

import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { LANDING_STATS } from "@/lib/marketing-content";
import { FadeUp } from "@/components/motion/FadeUp";

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="border-y border-border bg-gradient-to-r from-amber-500/5 via-transparent to-sky-500/5 px-4 py-12 sm:px-8">
      <FadeUp>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 lg:grid-cols-4">
          {LANDING_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-black text-foreground sm:text-4xl">
                {inView ? (
                  <CountUp
                    end={stat.value}
                    decimals={"decimals" in stat ? stat.decimals : 0}
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
