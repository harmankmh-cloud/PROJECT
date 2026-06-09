"use client";

import { Link2, QrCode, Sparkles } from "lucide-react";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { MARKETING } from "@/content/copy";

const ICONS = [Link2, QrCode, Sparkles];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-24" id="how-it-works">
      <div className="marketing-container">
        <div className="mb-12 text-center">
          <p className="section-eyebrow mb-3">How it works</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">Three steps to more reviews</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {MARKETING.howItWorks.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <FadeInSection key={step.n} delay={i * 0.1}>
                <div className="relative text-center">
                  {i < 2 && (
                    <div className="absolute left-[60%] top-8 hidden h-px w-[80%] border-t border-dashed border-border md:block" />
                  )}
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success-bg text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-4 font-display text-4xl text-primary/30">{step.n}</p>
                  <h3 className="mt-2 font-display text-lg text-text">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted">{step.text}</p>
                </div>
              </FadeInSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
