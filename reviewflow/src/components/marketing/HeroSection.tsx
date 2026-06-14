"use client";

import Link from "next/link";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { MARKETING } from "@/content/copy";
import { HeroDemoWidget } from "./HeroDemoWidget";

export function HeroSection() {
  return (
    <section className="mesh-bg relative overflow-hidden pb-16 pt-24 md:pb-24 md:pt-28">
      <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
      <div className="marketing-container relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeInSection>
            <p className="section-eyebrow mb-5">For BC local businesses</p>
            <h1 className="font-display text-4xl leading-[1.1] text-text md:text-5xl lg:text-[3.35rem]">
              {MARKETING.hero.h1}{" "}
              <span className="coral-underline text-primary">{MARKETING.hero.h1Highlight}</span>
              {MARKETING.hero.h1Suffix}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{MARKETING.hero.subtext}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="btn-primary-pill inline-flex gap-2 px-8 py-3.5 text-base">
                {MARKETING.hero.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/#how-it-works" className="btn-ghost inline-flex gap-2 px-8 py-3.5 text-base">
                {MARKETING.hero.ctaSecondary}
                <ChevronDown className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {MARKETING.hero.trustBadges.map((badge) => (
                <span key={badge} className="trust-pill">
                  <Check className="h-3.5 w-3.5 text-primary" />
                  {badge.replace(" ✓", "")}
                </span>
              ))}
            </div>
          </FadeInSection>
          <FadeInSection delay={0.15}>
            <HeroDemoWidget />
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
