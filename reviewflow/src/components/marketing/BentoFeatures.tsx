"use client";

import { BarChart3, Filter, Mail, MessageSquare, QrCode, Sparkles } from "lucide-react";
import { FadeInSection } from "@/components/ui/FadeInSection";

const FEATURES = [
  { icon: Sparkles, title: "AI Review Prompt Generator", size: "large", desc: "3 tailored prompts per visit" },
  { icon: QrCode, title: "QR Code Generator", size: "medium", desc: "Print-ready for counter cards" },
  { icon: Mail, title: "SMS / Email Requests", size: "medium", desc: "One-click send templates" },
  { icon: Filter, title: "Star Rating Filter", size: "small", desc: "Low ratings stay private" },
  { icon: BarChart3, title: "Review Dashboard", size: "small", desc: "Analytics at a glance" },
  { icon: MessageSquare, title: "Auto Follow-ups", size: "small", desc: "Reminder nudges" },
];

export function BentoFeatures() {
  return (
    <section className="py-20 md:py-28" id="features">
      <div className="marketing-container">
        <FadeInSection className="mb-14 text-center">
          <p className="section-eyebrow mx-auto mb-4 w-fit">Features</p>
          <h2 className="font-display text-3xl text-text md:text-4xl lg:text-[2.75rem]">
            Everything you need
          </h2>
        </FadeInSection>
        <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            const span =
              f.size === "large"
                ? "md:col-span-2 md:row-span-2"
                : f.size === "medium"
                  ? "md:col-span-1"
                  : "md:col-span-1";
            return (
              <FadeInSection key={f.title} delay={i * 0.05} className={span}>
                <div
                  className={`card-glow card-surface flex h-full flex-col ${f.size === "large" ? "min-h-[260px]" : ""}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-text">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted">{f.desc}</p>
                  {f.size === "large" && (
                    <div className="mt-auto space-y-2 pt-6">
                      {["Dr. Patel was thorough and kind...", "Best dental visit in years...", "Team made me comfortable..."].map(
                        (t) => (
                          <div
                            key={t}
                            className="rounded-xl border border-border/80 bg-surface/80 p-3 text-xs leading-relaxed text-text"
                          >
                            {t}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </FadeInSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
