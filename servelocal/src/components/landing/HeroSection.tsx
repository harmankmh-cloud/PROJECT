import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { HeroSearchBar } from "@/components/marketing/HeroSearchBar";
import { HeroIllustration } from "@/components/landing/HeroIllustration";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { WordSwap } from "@/components/landing/WordSwap";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 pb-16 pt-10 text-white sm:px-8 sm:pb-24 sm:pt-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(245,158,11,0.24),transparent_34%),radial-gradient(circle_at_86%_20%,rgba(56,189,248,0.24),transparent_36%),radial-gradient(circle_at_55%_100%,rgba(16,185,129,0.18),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-label text-xs text-amber-200">
            <Sparkles className="h-3.5 w-3.5" />
            New ServeLocal experience - built in BC
          </p>
          <h1 className="font-display mt-5 text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
            Hire trusted local
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-100 to-sky-200 bg-clip-text text-transparent">
              <WordSwap />
            </span>
            <span className="block text-balance text-slate-100">without the stress</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            We redesigned ServeLocal around one goal: help homeowners move from search to a
            confident hire faster, with clearer profile signals and better local matching.
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
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/18"
            >
              Join as a pro
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
            {[
              "No placeholder reviews",
              "Transparent profiles",
              "BC-first service areas",
              "Fast homeowner flow",
            ].map((line) => (
              <span
                key={line}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-slate-100"
              >
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
          <div className="mx-auto mt-4 grid max-w-lg grid-cols-2 gap-3 text-left text-xs text-slate-200">
            <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
              <p className="font-semibold text-white">Homeowner-first UX</p>
              <p className="mt-1 text-slate-300">Simpler route from search to hire.</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">
              <p className="font-semibold text-white">Local confidence</p>
              <p className="mt-1 text-slate-300">Built around BC service areas.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
