import { HeroSearchBar } from "@/components/marketing/HeroSearchBar";
import { HeroIllustration } from "@/components/landing/HeroIllustration";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { WordSwap } from "@/components/landing/WordSwap";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
      <div className="marketing-grid-bg-light pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl text-center lg:text-left">
          <p className="font-label text-primary">🍁 Serving Canada — starting in BC</p>
          <h1 className="font-display mt-4 text-4xl font-black leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Find Trusted Local
            <br />
            <WordSwap /> in Minutes
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            ServeLocal connects Canadian homeowners with vetted, reviewed contractors — fast booking,
            upfront pricing, zero stress.
          </p>
          <div className="mx-auto mt-8 max-w-2xl lg:mx-0">
            <HeroSearchBar />
          </div>
          <div className="mt-8">
            <TrustBadges />
          </div>
        </div>
        <div className="w-full max-w-md lg:max-w-lg">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
