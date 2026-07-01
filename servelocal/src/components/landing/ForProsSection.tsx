import Link from "next/link";
import { ArrowRight, Briefcase, Home } from "lucide-react";
import { FadeUp } from "@/components/motion/FadeUp";

export function ForProsSection() {
  return (
    <section className="px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 lg:grid-cols-2">
          <FadeUp>
            <div className="sl-card flex h-full flex-col p-8">
              <div className="sl-icon-tile flex h-12 w-12">
                <Home className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-5 text-2xl font-bold text-white">
                Need something fixed?
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                Post your project and get connected with local pros that match your needs. Compare
                profiles, read homeowner feedback, and choose confidently.
              </p>
              <Link href="/request" className="sl-btn-primary mt-6 self-start">
                Post a Job Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-violet-400/30 bg-gradient-to-br from-[#7c5cff]/20 via-[#ff45a8]/10 to-transparent p-8 backdrop-blur">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.4),transparent_65%)] blur-2xl" />
              <div className="sl-icon-tile relative flex h-12 w-12">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="font-display relative mt-5 text-2xl font-bold text-white">
                Are you a contractor?
              </h3>
              <p className="relative mt-2 flex-1 text-sm leading-relaxed text-slate-300">
                Grow your business with homeowner leads in your service area, clearer profile
                visibility, and straightforward monthly plans.
              </p>
              <Link href="/join" className="sl-btn-ghost relative mt-6 self-start">
                Join as a Pro
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
