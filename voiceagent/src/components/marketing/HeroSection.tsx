import Link from "next/link";
import { ArrowRight, Check, Play } from "lucide-react";
import { HeroPhonePreview } from "./HeroPhonePreview";

const TRUST_BADGES = [
  "No credit card required",
  "Setup in 10 minutes",
  "Cancel anytime",
] as const;

export function HeroSection() {
  return (
    <section className="aurora-bg relative overflow-hidden pb-20 pt-28 md:pb-28 md:pt-32">
      <div className="grid-pattern absolute inset-0 opacity-30" />
      <div className="marketing-container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-1.5 text-sm">
            <span className="pulse-dot" />
            <span className="text-muted">AI Receptionist — Now Live in Canada</span>
          </div>

          <h1 className="font-display text-[2.5rem] leading-[1.05] md:text-[4.5rem]">
            Your Business Never Misses a Call.{" "}
            <span className="gradient-text">Ever.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            GreetQ answers calls 24/7, books appointments, and handles FAQs — while you focus on your work.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary inline-flex gap-2 px-8 py-3.5">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/#demo" className="btn-secondary inline-flex gap-2 px-8 py-3.5">
              <Play className="h-4 w-4" />
              Watch Demo
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
            {TRUST_BADGES.map((badge) => (
              <span key={badge} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-success" />
                {badge}
              </span>
            ))}
          </div>
        </div>

        <HeroPhonePreview />
      </div>
    </section>
  );
}
