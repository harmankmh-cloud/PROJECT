import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { HeroSearchBar } from "@/components/marketing/HeroSearchBar";
import { HeroIllustration } from "@/components/landing/HeroIllustration";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { WordSwap } from "@/components/landing/WordSwap";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border px-4 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
      <div className="marketing-grid-bg-light pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-amber-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl text-center lg:text-left">
          <p className="font-label text-primary">🍁 Built in BC for Canadian homeowners</p>
          <h1 className="font-display mt-4 text-4xl font-black leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Find trusted local
            <br />
            <WordSwap />
            <span className="block text-balance">with zero guesswork</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            ServeLocal helps you compare trusted pros faster with clear profiles, verified signals,
            and a direct path from search to booked work.
          </p>
          <div className="mx-auto mt-8 max-w-2xl lg:mx-0">
            <HeroSearchBar />
          </div>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <ShimmerButton href="/request" size="md">
              Post a job
              <ArrowRight className="h-4 w-4" />
            </ShimmerButton>
            <Link
              href="/for-pros"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:border-amber-400/50 hover:text-primary"
            >
              Join as a pro
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
            {["No placeholder reviews", "Transparent profiles", "BC-first service areas"].map(
              (line) => (
                <span
                  key={line}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  {line}
                </span>
              )
            )}
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
