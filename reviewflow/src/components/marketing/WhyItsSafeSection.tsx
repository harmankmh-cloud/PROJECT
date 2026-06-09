"use client";

import { Shield, ShieldCheck } from "lucide-react";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { MARKETING } from "@/content/copy";

export function WhyItsSafeSection() {
  return (
    <section className="border-t border-border bg-surface py-20 md:py-24" id="safe">
      <div className="marketing-container">
        <FadeInSection className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-bg">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-display text-3xl text-text md:text-4xl">{MARKETING.whySafe.headline}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">{MARKETING.whySafe.subtext}</p>
        </FadeInSection>
        <div className="grid gap-6 md:grid-cols-3">
          {MARKETING.whySafe.cards.map((card, i) => (
            <FadeInSection key={card.title} delay={i * 0.1}>
              <div className="card-surface h-full">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-display text-lg text-text">{card.title}</h3>
                <p className="mt-2 text-sm text-muted">{card.text}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
