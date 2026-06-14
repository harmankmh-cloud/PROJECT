"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { MARKETING } from "@/content/copy";
import {
  proAnnualFootnote,
  proDisplayPrice,
  proPriceSuffix,
  RATELOCAL_CHECKOUT_NOTE,
  RATELOCAL_COMPETITORS,
} from "@/lib/pricing-display";
import { useUiStore } from "@/stores/ui";

export function PricingSection() {
  const { pricingAnnual, setPricingAnnual } = useUiStore();

  return (
    <section className="bg-surface/30 py-20 md:py-28" id="pricing">
      <div className="marketing-container">
        <FadeInSection className="mb-12 text-center">
          <p className="section-eyebrow mx-auto mb-4 w-fit">Pricing</p>
          <h2 className="font-display text-3xl text-text md:text-4xl lg:text-[2.75rem]">
            Simple, honest pricing
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Pro is less than half NiceJob (${RATELOCAL_COMPETITORS.niceJob}/mo) and a fraction of Podium
            (${RATELOCAL_COMPETITORS.podium}+/mo) — same goal: more Google reviews.
          </p>
          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setPricingAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                !pricingAnnual ? "bg-primary text-white shadow-sm" : "text-muted hover:text-text"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setPricingAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                pricingAnnual ? "bg-primary text-white shadow-sm" : "text-muted hover:text-text"
              }`}
            >
              Annual
              <span className={`ml-1.5 text-xs ${pricingAnnual ? "text-white/90" : "text-accent"}`}>
                {MARKETING.pricing.annualBadge}
              </span>
            </button>
          </div>
        </FadeInSection>
        <div className="grid gap-6 md:grid-cols-3">
          {MARKETING.pricing.tiers.map((tier, i) => {
            const price =
              tier.key === "pro" ? proDisplayPrice(pricingAnnual) : pricingAnnual ? tier.annual : tier.monthly;
            const suffix = proPriceSuffix(pricingAnnual, tier.key);
            const annualFootnote = proAnnualFootnote(pricingAnnual, tier.key);
            return (
              <FadeInSection key={tier.key} delay={i * 0.1}>
                <div
                  className={`card-glow card-surface relative flex h-full flex-col ${
                    tier.popular ? "pricing-popular border-2 border-primary shadow-lg shadow-primary/10" : ""
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-white shadow-md shadow-primary/30">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-display text-xl text-text">{tier.name}</h3>
                  <p className="mt-1 text-sm text-muted">{tier.description}</p>
                  <p className="mt-5 font-display text-4xl tracking-tight text-text">
                    ${price}
                    {price > 0 && <span className="text-base font-normal text-muted">{suffix}</span>}
                  </p>
                  {annualFootnote && (
                    <p className="mt-1 text-xs text-muted">{annualFootnote}</p>
                  )}
                  {"stripeNote" in tier && tier.stripeNote && !pricingAnnual && (
                    <p className="mt-2 text-xs font-medium text-primary">{tier.stripeNote}</p>
                  )}
                  <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-text">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                    {tier.missing.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-muted">
                        <X className="mt-0.5 h-4 w-4 shrink-0 opacity-50" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.key === "agency" ? "/help" : "/signup"}
                    className={`mt-8 block py-3.5 text-center text-sm font-semibold ${
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
        <p className="mt-6 text-center text-xs text-muted">{RATELOCAL_CHECKOUT_NOTE}</p>
      </div>
    </section>
  );
}
