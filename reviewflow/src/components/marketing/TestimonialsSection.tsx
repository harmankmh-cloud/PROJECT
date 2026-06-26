"use client";

import { Quote, Star } from "lucide-react";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { TESTIMONIALS, TRUST_BADGES } from "@/lib/marketing-content";

export function TestimonialsSection() {
  return (
    <section className="border-t border-border/80 py-20 md:py-28" id="proof">
      <div className="marketing-container">
        <FadeInSection className="mb-12 text-center">
          <p className="section-eyebrow mx-auto mb-4 w-fit">Proof</p>
          <h2 className="font-display text-3xl text-text md:text-4xl lg:text-[2.75rem]">
            Built for local teams that want more reviews without extra admin
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            RateLocal keeps the customer experience short, gives owners better follow-up, and helps frontline staff ask more confidently.
          </p>
        </FadeInSection>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <FadeInSection className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((item, index) => (
              <article key={`${item.company}-${index}`} className="card-glow card-surface flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-star">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star key={star} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="h-5 w-5 text-primary/40" />
                </div>
                <p className="mt-5 flex-1 text-sm leading-relaxed text-text">“{item.quote}”</p>
                <div className="mt-6 border-t border-border/80 pt-4">
                  <p className="font-semibold text-text">{item.name}</p>
                  <p className="text-sm text-muted">
                    {item.role} · {item.company}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">{item.industry}</p>
                </div>
              </article>
            ))}
          </FadeInSection>

          <FadeInSection delay={0.1} className="card-glow card-surface">
            <p className="section-eyebrow mb-4 w-fit">Why teams trust it</p>
            <h3 className="font-display text-2xl text-text">Everything around the review ask feels more polished</h3>
            <div className="mt-6 grid gap-3">
              {TRUST_BADGES.map((badge) => (
                <div key={badge.label} className="rounded-2xl border border-border/80 bg-white/70 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                      {badge.icon}
                    </span>
                    <div>
                      <p className="font-semibold text-text">{badge.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{badge.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
