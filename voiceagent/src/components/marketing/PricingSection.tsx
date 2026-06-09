"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { useUiStore } from "@/stores/ui";
import { PLANS } from "@/lib/plans";
import { FadeInSection } from "@/components/ui/FadeInSection";

type TierKey = "starter" | "growth" | "pro";

const TIERS: { key: TierKey; label: string; popular?: boolean }[] = [
  { key: "starter", label: "Starter" },
  { key: "growth", label: "Growth", popular: true },
  { key: "pro", label: "Pro" },
];

const FEATURE_MATRIX: Record<TierKey, { label: string; included: boolean }[]> = {
  starter: [
    { label: "1 AI agent", included: true },
    { label: "300 minutes included", included: true },
    { label: "Call logs", included: true },
    { label: "Flow builder", included: false },
    { label: "Outbound campaigns", included: false },
  ],
  growth: [
    { label: "2 AI agents", included: true },
    { label: "900 minutes included", included: true },
    { label: "Flow builder", included: true },
    { label: "Google Calendar", included: true },
    { label: "Outbound campaigns", included: false },
  ],
  pro: [
    { label: "5 AI agents", included: true },
    { label: "2,000 minutes included", included: true },
    { label: "HubSpot + Calendar", included: true },
    { label: "Outbound campaigns", included: true },
    { label: "Priority support", included: true },
  ],
};

export function PricingSection() {
  const annual = useUiStore((s) => s.pricingAnnual);
  const setAnnual = useUiStore((s) => s.setPricingAnnual);

  return (
    <section className="border-t border-border py-20 md:py-[80px]" id="pricing">
      <div className="marketing-container">
        <div className="mb-10 text-center">
          <p className="section-eyebrow mb-3">Pricing</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">Simple, predictable plans</h2>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-sm ${!annual ? "bg-primary text-white" : "text-muted"}`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`rounded-full px-4 py-1.5 text-sm ${annual ? "bg-primary text-white" : "text-muted"}`}
            >
              Annual
              <span className="ml-1 text-xs text-accent">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TIERS.map((tier, i) => {
            const plan = PLANS[tier.key];
            const price = annual
              ? Math.round(plan.monthlyPrice * 12 * 0.8)
              : plan.monthlyPrice;
            const period = annual ? "/yr" : "/mo";

            return (
              <FadeInSection key={tier.key} delay={i * 0.1}>
                <div
                  className={`relative rounded-xl p-6 transition ${
                    tier.popular
                      ? "scale-[1.02] border-2 border-primary shadow-[0_0_24px_rgba(99,102,241,0.3)]"
                      : "card-glow"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-white">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-display text-xl text-text">{tier.label}</h3>
                  <p className="mt-4 font-display text-4xl text-text">
                    ${price}
                    <span className="text-lg text-muted">{period}</span>
                  </p>
                  <ul className="mt-6 space-y-3">
                    {FEATURE_MATRIX[tier.key].map((f) => (
                      <li key={f.label} className="flex items-center gap-2 text-sm">
                        {f.included ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <X className="h-4 w-4 text-muted/40" />
                        )}
                        <span className={f.included ? "text-text" : "text-muted/50"}>{f.label}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/signup?plan=${tier.key}`}
                    className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold ${
                      tier.popular ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </FadeInSection>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Enterprise plans available —{" "}
          <Link href="/help?intent=enterprise" className="text-primary-glow hover:underline">
            contact sales
          </Link>
        </p>
      </div>
    </section>
  );
}
