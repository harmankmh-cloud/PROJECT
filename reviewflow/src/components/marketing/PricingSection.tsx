"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { MARKETING } from "@/content/copy";
import { useUiStore } from "@/stores/ui";

export function PricingSection() {
  const { pricingAnnual, setPricingAnnual } = useUiStore();

  return (
    <section className="bg-white py-20 md:py-24" id="pricing">
      <div className="marketing-container">
        <div className="mb-10 text-center">
          <p className="section-eyebrow mb-3">Pricing</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">Simple, honest pricing</h2>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setPricingAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${!pricingAnnual ? "bg-white shadow-sm" : "text-muted"}`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setPricingAnnual(true)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${pricingAnnual ? "bg-white shadow-sm" : "text-muted"}`}
            >
              Annual
              <span className="ml-1 text-xs text-primary">{MARKETING.pricing.annualBadge}</span>
            </button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {MARKETING.pricing.tiers.map((tier, i) => {
            const price = pricingAnnual ? tier.annual : tier.monthly;
            return (
              <FadeInSection key={tier.key} delay={i * 0.1}>
                <div
                  className={`card-surface relative flex h-full flex-col ${
                    tier.popular ? "border-2 border-primary shadow-md" : ""
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-display text-xl text-text">{tier.name}</h3>
                  <p className="mt-1 text-sm text-muted">{tier.description}</p>
                  <p className="mt-4 font-display text-4xl text-text">
                    ${price}
                    {price > 0 && <span className="text-base font-normal text-muted">/mo</span>}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2 text-sm">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-text">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                    {tier.missing.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-muted">
                        <X className="mt-0.5 h-4 w-4 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.key === "agency" ? "/help" : "/signup"}
                    className={`mt-8 block py-3 text-center text-sm font-semibold ${
                      tier.popular ? "btn-primary-pill" : "btn-ghost"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </FadeInSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
