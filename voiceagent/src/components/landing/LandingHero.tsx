import Link from "next/link";
import { Play } from "lucide-react";
import { LANDING_COPY } from "@/lib/copy/landing";
import { GlowButton } from "@/components/ui/GlowButton";
import { HeroPhoneWidget } from "./HeroPhoneWidget";
import { HeroWordSwap } from "./HeroWordSwap";

export function LandingHero() {
  return (
    <section className="hero-mesh relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
      <div className="grid-pattern pointer-events-none absolute inset-0 opacity-30" />
      <div className="marketing-container relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
            <span className="pulse-dot bg-violet-400" />
            {LANDING_COPY.hero.eyebrow}
          </p>
          <h1 className="font-display text-[2.35rem] leading-[1.08] tracking-tight md:text-5xl lg:text-[3.25rem]">
            {LANDING_COPY.hero.headline}{" "}
            <HeroWordSwap />
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">{LANDING_COPY.hero.subhead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <GlowButton href="/signup">{LANDING_COPY.hero.ctaPrimary}</GlowButton>
            <GlowButton href="/demo" variant="ghost" className="gap-2">
              <Play className="h-4 w-4" />
              {LANDING_COPY.hero.ctaSecondary}
            </GlowButton>
          </div>
          <p className="mt-4 text-sm text-muted">{LANDING_COPY.hero.footnote}</p>
          <div className="mt-6 flex flex-wrap gap-2" aria-label="Capabilities">
            {LANDING_COPY.hero.capabilities.map((cap) => (
              <Link
                key={cap.label}
                href={cap.href}
                className="rounded-full border border-border/80 bg-white/[0.03] px-3 py-1.5 text-xs text-muted transition hover:border-violet-500/40 hover:text-text"
              >
                {cap.label}
              </Link>
            ))}
          </div>
        </div>
        <HeroPhoneWidget />
      </div>
    </section>
  );
}
