import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { MARKETING } from "@/content/copy";
import { HeroDemoWidget } from "./HeroDemoWidget";

export function HeroSection() {
  return (
    <section className="mesh-bg relative overflow-hidden pb-16 pt-24 md:pb-24 md:pt-28">
      <div className="marketing-container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="font-display text-4xl leading-tight text-text md:text-5xl lg:text-[3.25rem]">
              {MARKETING.hero.h1}{" "}
              <span className="green-underline text-primary">{MARKETING.hero.h1Highlight}</span>
              {MARKETING.hero.h1Suffix}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">{MARKETING.hero.subtext}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="btn-primary-pill inline-flex gap-2 px-8 py-3.5">
                {MARKETING.hero.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/#how-it-works" className="btn-ghost inline-flex gap-2 px-8 py-3.5">
                {MARKETING.hero.ctaSecondary}
                <ChevronDown className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {MARKETING.hero.trustBadges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>
          </div>
          <HeroDemoWidget />
        </div>
      </div>
    </section>
  );
}
