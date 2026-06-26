import Link from "next/link";
import { ArrowRight, Briefcase, Home } from "lucide-react";
import { FadeUp } from "@/components/motion/FadeUp";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

export function ForProsSection() {
  return (
    <section className="px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 lg:grid-cols-2">
          <FadeUp>
            <div className="card-glow flex h-full flex-col rounded-[14px] border border-border bg-surface p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-400/15 text-secondary">
                <Home className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-5 text-2xl font-bold text-foreground">
                Need something fixed?
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                Post your project free and get matched with verified local pros. Compare quotes,
                read reviews, and book with confidence.
              </p>
              <ShimmerButton href="/request" className="mt-6">
                Post a Job Free
                <ArrowRight className="h-4 w-4" />
              </ShimmerButton>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="card-glow flex h-full flex-col rounded-[14px] border border-amber-400/20 bg-gradient-to-br from-amber-500/5 to-sky-500/5 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/15 text-primary">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-5 text-2xl font-bold text-foreground">
                Are you a contractor?
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                Get leads in your area, set your own rates, and get paid fast — flat $29/mo, no
                per-lead fees.
              </p>
              <Link
                href="/join"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
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
