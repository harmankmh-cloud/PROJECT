"use client";

import { Link2, QrCode, Sparkles } from "lucide-react";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { MARKETING } from "@/content/copy";

const ICONS = [Link2, QrCode, Sparkles];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28" id="how-it-works">
      <div className="marketing-container">
        <FadeInSection className="mb-14 text-center">
          <p className="section-eyebrow mx-auto mb-4 w-fit">How it works</p>
          <h2 className="font-display text-3xl text-text md:text-4xl lg:text-[2.75rem]">
            Three steps to more reviews
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Set up once, share your link, and let AI help customers write authentic Google reviews.
          </p>
        </FadeInSection>
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {MARKETING.howItWorks.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <FadeInSection key={step.n} delay={i * 0.1}>
                <div className="card-glow card-surface relative h-full text-center">
                  {i < 2 && (
                    <div className="absolute -right-4 top-10 hidden h-px w-8 border-t border-dashed border-primary/25 md:block lg:-right-6 lg:w-12" />
                  )}
                  <div className="step-badge">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="mt-4 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                    Step {step.n}
                  </span>
                  <h3 className="mt-3 font-display text-lg text-text">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
                </div>
              </FadeInSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
