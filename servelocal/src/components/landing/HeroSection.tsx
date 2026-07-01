import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { HeroSearchBar } from "@/components/marketing/HeroSearchBar";
import { HeroIllustration } from "@/components/landing/HeroIllustration";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { WordSwap } from "@/components/landing/WordSwap";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
      <div className="sl-grid-overlay pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -top-44 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.42),transparent_62%)] blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="text-center lg:text-left">
          <p className="sl-eyebrow">
            <Sparkles className="h-3.5 w-3.5" />
            New ServeLocal experience &mdash; built in BC
          </p>
          <h1 className="font-display mt-6 text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-[4.15rem]">
            <span className="text-white">Hire trusted local</span>
            <br />
            <WordSwap />
            <span className="block text-slate-200">without the stress</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            We rebuilt ServeLocal around one goal: move homeowners from search to a confident
            hire faster, with clearer profile signals and sharper local matching.
          </p>

          <div className="mx-auto mt-8 max-w-2xl lg:mx-0">
            <HeroSearchBar />
          </div>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <Link href="/request" className="sl-btn-primary">
              Post a job
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/for-pros" className="sl-btn-ghost">
              Join as a pro
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
            {[
              "No placeholder reviews",
              "Transparent profiles",
              "BC-first service areas",
              "Fast homeowner flow",
            ].map((line) => (
              <span key={line} className="sl-chip">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                {line}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <TrustBadges dark />
          </div>
        </div>

        <div className="w-full">
          <HeroIllustration />
          <div className="mx-auto mt-4 grid max-w-lg grid-cols-2 gap-3 text-left text-xs text-slate-300">
            <div className="sl-card px-3.5 py-3">
              <p className="font-semibold text-white">Homeowner-first UX</p>
              <p className="mt-1 text-slate-400">Simpler route from search to hire.</p>
            </div>
            <div className="sl-card px-3.5 py-3">
              <p className="font-semibold text-white">Local confidence</p>
              <p className="mt-1 text-slate-400">Built around BC service areas.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
