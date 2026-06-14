"use client";

import { Shield, ShieldCheck } from "lucide-react";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { MARKETING } from "@/content/copy";

export function WhyItsSafeSection() {
  return (
    <section className="border-t border-border/80 bg-surface/40 py-20 md:py-28" id="safe">
      <div className="marketing-container">
        <FadeInSection className="mb-14 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 shadow-sm">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <p className="section-eyebrow mx-auto mb-4 w-fit">Google-safe</p>
          <h2 className="font-display text-3xl text-text md:text-4xl lg:text-[2.75rem]">
            {MARKETING.whySafe.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">{MARKETING.whySafe.subtext}</p>
        </FadeInSection>
        <div className="grid gap-6 md:grid-cols-3">
          {MARKETING.whySafe.cards.map((card, i) => (
            <FadeInSection key={card.title} delay={i * 0.1}>
              <div className="card-glow card-surface h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-5 font-display text-lg text-text">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{card.text}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
