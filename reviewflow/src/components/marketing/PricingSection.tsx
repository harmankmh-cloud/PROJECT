"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { MARKETING } from "@/content/copy";
import {
  RATELOCAL_CHECKOUT_NOTE,
  RATELOCAL_COMPETITORS,
} from "@/lib/pricing-display";

export function PricingSection() {
  return (
    <section className="bg-surface/30 py-20 md:py-28" id="pricing">
      <div className="marketing-container">
        <FadeInSection className="mb-12 text-center">
          <p className="section-eyebrow mx-auto mb-4 w-fit">Pricing</p>
          <h2 className="font-display text-3xl text-text md:text-4xl lg:text-[2.75rem]">
            Simple, honest pricing
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Start with 50 free reviews. When you&apos;re ready to grow, upgrade to Pro for just $39/mo — less than
            half of NiceJob (${RATELOCAL_COMPETITORS.niceJob}/mo) and a fraction of Podium
            (${RATELOCAL_COMPETITORS.podium}+/mo).
          </p>
        </FadeInSection>
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          {MARKETING.pricing.tiers.map((tier, i) => (
            <FadeInSection key={tier.key} delay={i * 0.1}>
              <div
                className={`card-glow card-surface relative flex h-full flex-col ${
                  tier.popular ? "pricing-popular border-2 border-primary shadow-lg shadow-primary/10" : ""
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-white shadow-md shadow-primary/30">
                    Everything Included
                  </span>
                )}
                <h3 className="font-display text-xl text-text">{tier.name}</h3>
                <p className="mt-1 text-sm text-muted">{tier.description}</p>
                <p className="mt-5 font-display text-4xl tracking-tight text-text">
                  ${tier.monthly}
                  {tier.monthly > 0 && <span className="text-base font-normal text-muted">/mo</span>}
                </p>
                {"stripeNote" in tier && tier.stripeNote && (
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
                {"limitNote" in tier && tier.limitNote && (
                  <p className="mt-4 rounded-xl bg-primary/5 px-3 py-2 text-xs text-muted">{tier.limitNote}</p>
                )}
                <Link
                  href="/signup"
                  className={`mt-8 block py-3.5 text-center text-sm font-semibold ${
                    tier.popular ? "btn-primary-pill" : "btn-ghost"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </FadeInSection>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted">{RATELOCAL_CHECKOUT_NOTE}</p>
      </div>
    </section>
  );
}
