"use client";

import { MapPin, Star } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { MARKETING } from "@/content/copy";

export function StatsBar() {
  return (
    <section className="border-y border-border/80 bg-surface/50 py-8">
      <div className="marketing-container">
        <FadeInSection>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <div className="stat-chip text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-star text-star" />
                <p className="font-display text-2xl text-text md:text-3xl">4.9</p>
              </div>
              <p className="mt-1 text-sm text-muted">{MARKETING.statsBar[0].label}</p>
            </div>
            <div className="stat-chip text-center">
              <p className="font-display text-2xl text-text md:text-3xl">
                <CountUp value={500} suffix="+" />
              </p>
              <p className="mt-1 text-sm text-muted">{MARKETING.statsBar[1].label}</p>
            </div>
            <div className="stat-chip text-center">
              <div className="flex items-center justify-center gap-1.5">
                <MapPin className="h-5 w-5 text-primary" />
                <p className="font-display text-2xl text-text md:text-3xl">BC</p>
              </div>
              <p className="mt-1 text-sm text-muted">{MARKETING.statsBar[2].label}</p>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
