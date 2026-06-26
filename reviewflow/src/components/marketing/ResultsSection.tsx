"use client";

import { ArrowRightLeft, BadgeCheck, LineChart, ScanSearch } from "lucide-react";
import Link from "next/link";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { COMPARISON_ROWS } from "@/lib/marketing-content";

const OUTCOMES = [
  {
    icon: ScanSearch,
    title: "Counter-to-review flow",
    text: "Turn in-person visits, receipts, and reminders into a simple review path your team can actually use.",
  },
  {
    icon: BadgeCheck,
    title: "Private feedback before damage",
    text: "Unhappy customers get a calm private path first so you can recover issues before they hit your public rating.",
  },
  {
    icon: LineChart,
    title: "Clear proof inside the dashboard",
    text: "See scans, visits, and draft usage so you know what is helping you earn more reviews.",
  },
] as const;

export function ResultsSection() {
  return (
    <section className="bg-surface/30 py-20 md:py-28" id="results">
      <div className="marketing-container">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <FadeInSection className="card-glow card-surface h-full">
            <p className="section-eyebrow mb-4 w-fit">What changes</p>
            <h2 className="font-display text-3xl text-text md:text-4xl">Replace the awkward ask with a smoother review flow</h2>
            <div className="mt-8 space-y-3">
              {COMPARISON_ROWS.map((row) => (
                <div
                  key={row.them}
                  className="grid gap-3 rounded-2xl border border-border/80 bg-white/70 p-4 md:grid-cols-[1fr_auto_1fr] md:items-center"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Without RateLocal</p>
                    <p className="mt-1 text-sm text-text">{row.them}</p>
                  </div>
                  <ArrowRightLeft className="mx-auto h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">With RateLocal</p>
                    <p className="mt-1 text-sm font-medium text-text">{row.us}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1} className="grid gap-4">
            {OUTCOMES.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card-glow card-surface h-full">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-text">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                  {index === OUTCOMES.length - 1 ? (
                    <Link href="/pricing" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      See full plan details
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
