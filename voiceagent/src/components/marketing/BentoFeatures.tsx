"use client";

import { Calendar, Globe, MessageSquare, Mic, PhoneForwarded, Languages } from "lucide-react";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { FEATURE_CARDS } from "@/lib/marketing-content";
import { TranscriptPreview } from "./TranscriptPreview";

const SMALL = [
  { icon: MessageSquare, title: "SMS summaries", desc: "Post-call text to your phone" },
  { icon: Mic, title: "Custom greetings", desc: "Your brand voice, your script" },
  { icon: Languages, title: "Multi-language", desc: "English + Spanish beta" },
  { icon: PhoneForwarded, title: "Call forwarding", desc: "Warm transfer with context" },
] as const;

export function BentoFeatures() {
  return (
    <section className="border-t border-border py-20 md:py-[80px]" id="features">
      <div className="marketing-container">
        <div className="mb-12 text-center">
          <p className="section-eyebrow mb-3">Features</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">Built for real businesses</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
          <FadeInSection className="glass-card group col-span-2 row-span-2 min-h-[280px] transition hover:shadow-[0_0_24px_rgba(99,102,241,0.2)]">
            <p className="mb-2 text-sm font-medium text-primary-glow">Live transcript</p>
            <h3 className="font-display text-xl text-text">See every conversation</h3>
            <div className="mt-4 h-48 rounded-lg bg-bg/50">
              <TranscriptPreview />
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1} className="glass-card group transition hover:shadow-[0_0_24px_rgba(99,102,241,0.2)]">
            <Calendar className="mb-3 h-6 w-6 text-primary-glow" />
            <h3 className="font-display text-lg text-text">Appointment Booking</h3>
            <div className="mt-3 rounded-lg bg-bg/50 p-3 text-xs">
              <p className="text-muted">Thu, Mar 12</p>
              <p className="mt-1 font-medium text-accent">2:00 PM — Sarah M.</p>
              <p className="text-muted">Dental cleaning</p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.15} className="glass-card group transition hover:shadow-[0_0_24px_rgba(99,102,241,0.2)]">
            <Globe className="mb-3 h-6 w-6 text-accent" />
            <h3 className="font-display text-lg text-text">24/7 Coverage</h3>
            <p className="mt-2 text-sm text-muted">Never close. Timezone-aware hours.</p>
            <div className="mt-3 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-accent/60" />
              ))}
            </div>
          </FadeInSection>

          {SMALL.map((item, i) => (
            <FadeInSection
              key={item.title}
              delay={0.2 + i * 0.05}
              className="glass-card transition hover:shadow-[0_0_24px_rgba(99,102,241,0.2)]"
            >
              <item.icon className="mb-2 h-5 w-5 text-muted" />
              <h4 className="text-sm font-semibold text-text">{item.title}</h4>
              <p className="mt-1 text-xs text-muted">{item.desc}</p>
            </FadeInSection>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_CARDS.map((card, i) => (
            <FadeInSection
              key={card.title}
              delay={0.1 + i * 0.04}
              className="glass-card p-5 transition hover:shadow-[0_0_24px_rgba(99,102,241,0.15)]"
            >
              <h3 className="font-display text-base text-text">{card.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">{card.desc}</p>
              <ul className="mt-3 space-y-1">
                {card.bullets.slice(0, 3).map((b) => (
                  <li key={b} className="text-xs text-muted">
                    · {b}
                  </li>
                ))}
              </ul>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
