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
    <section className="py-20 md:py-24" id="features">
      <div className="marketing-container">
        <div className="mb-12 text-center">
          <p className="section-eyebrow mb-3">Features</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">Everything you need</h2>
        </div>
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
                  className={`card-surface flex h-full flex-col ${f.size === "large" ? "min-h-[240px]" : ""}`}
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 font-display text-lg text-text">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted">{f.desc}</p>
                  {f.size === "large" && (
                    <div className="mt-auto space-y-2 pt-6">
                      {["Dr. Patel was thorough and kind...", "Best dental visit in years...", "Team made me comfortable..."].map(
                        (t) => (
                          <div key={t} className="rounded-xl border border-border bg-surface p-3 text-xs text-text">
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
