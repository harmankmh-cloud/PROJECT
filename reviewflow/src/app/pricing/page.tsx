import type { Metadata } from "next";
import Link from "next/link";
import { PricingSection } from "@/components/marketing/PricingSection";
import { ResultsSection } from "@/components/marketing/ResultsSection";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { BRAND } from "@/lib/brand";
import { PRICING } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Pricing — 50 Free Reviews, Then $39/mo",
  description:
    "RateLocal pricing: start with 50 free review requests, no credit card needed. Upgrade to Pro for $39/mo — everything included, no setup fee, 14-day money-back guarantee.",
  alternates: { canonical: "/pricing" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: `${BRAND.name} Pro`,
  description:
    "Review collection software for BC local businesses — AI prompts, QR poster, SMS templates, analytics, and private feedback routing.",
  url: `https://${BRAND.domain}/pricing`,
  brand: { "@type": "Brand", name: BRAND.name },
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "CAD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "0",
        priceCurrency: "CAD",
        referenceQuantity: { "@type": "QuantitativeValue", value: "1", unitCode: "MON" },
      },
      description: "50 review requests included, no credit card required.",
      eligibleQuantity: { "@type": "QuantitativeValue", value: 50 },
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: `${PRICING.monthlyUsd}`,
      priceCurrency: "CAD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: `${PRICING.monthlyUsd}`,
        priceCurrency: "CAD",
        referenceQuantity: { "@type": "QuantitativeValue", value: "1", unitCode: "MON" },
      },
      description:
        "Unlimited review requests, AI prompt generator, QR poster, SMS templates, analytics, private feedback routing, and 14-day money-back guarantee.",
      availability: "https://schema.org/InStock",
    },
  ],
};

export default function PricingPage() {
  return (
    <MarketingPageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="mesh-bg relative overflow-hidden pb-16 pt-24 md:pb-24 md:pt-28">
        <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="marketing-container relative text-center">
          <p className="section-eyebrow mx-auto mb-5 w-fit">Pricing</p>
          <h1 className="font-display text-4xl text-text md:text-5xl lg:text-[3.35rem]">
            Start free. Then grow with <span className="coral-underline text-primary">$39/mo</span> — everything included
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Start with 50 free review requests — no credit card needed. When you're ready to scale, unlock everything for just $39/mo with no setup fee.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ShimmerButton href="/signup" className="px-8 py-3.5 text-base">
              Start free trial
            </ShimmerButton>
            <Link href="/help" className="btn-ghost px-8 py-3.5 text-base">
              Talk to the team
            </Link>
          </div>
        </div>
      </section>

      <PricingSection />
      <ResultsSection />

      <section className="border-t border-border/80 bg-surface/30 py-20">
        <div className="marketing-container">
          <div className="card-glow card-surface mx-auto max-w-3xl text-center">
            <p className="section-eyebrow mx-auto mb-4 w-fit">Bundle option</p>
            <h2 className="font-display text-3xl text-text md:text-4xl">Want reviews and better call coverage?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Add GreetQ for an always-on AI phone agent and pair it with {BRAND.name} for a cleaner front-desk and stronger reputation flow.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ShimmerButton href="/signup" className="px-8 py-3.5">
                Start with RateLocal
              </ShimmerButton>
              <Link href="/help" className="btn-ghost px-8 py-3.5">
                Ask about bundles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
