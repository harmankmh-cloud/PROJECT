"use client";

import { LANDING } from "@/content/copy";
import { CountUp } from "@/components/ui/CountUp";
import { FadeInSection } from "@/components/ui/FadeInSection";

export function PlatformStatsBar() {
  return (
    <section className="border-y border-border bg-surface/50 py-10">
      <div className="marketing-container">
        <FadeInSection>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {LANDING.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl text-text md:text-3xl">
                  {"isDecimal" in stat && stat.isDecimal ? (
                    <span>
                      {stat.value}
                      {stat.suffix}
                    </span>
                  ) : (
                    <>
                      <CountUp value={stat.value as number} />
                      {stat.suffix}
                    </>
                  )}
                </p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
