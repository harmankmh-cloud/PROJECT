"use client";

import { Briefcase, MapPin, Shield, Sparkles } from "lucide-react";
import { LANDING } from "@/content/copy";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { StaggerChildren, StaggerItem } from "@/components/ui/StaggerChildren";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  sparkles: Sparkles,
  briefcase: Briefcase,
  maple: MapPin,
};

export function WhyRateLocal() {
  return (
    <section className="border-t border-border py-16 md:py-20">
      <div className="marketing-container">
        <FadeInSection className="mb-12 text-center">
          <h2 className="font-display text-2xl text-text md:text-3xl">Why RateLocal</h2>
          <p className="mt-2 text-muted">The smarter way to discover and support local</p>
        </FadeInSection>

        <StaggerChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {LANDING.why.map((pillar) => {
            const Icon = ICONS[pillar.icon] ?? Shield;
            return (
              <StaggerItem key={pillar.title}>
                <div className="card-glow h-full p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-star/10 text-star">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-text">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{pillar.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
