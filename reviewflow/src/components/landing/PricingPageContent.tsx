"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { StaggerChildren, StaggerItem } from "@/components/ui/StaggerChildren";
import {
  proDisplayPrice,
  RATELOCAL_CHECKOUT_NOTE,
  RATELOCAL_PRO_ANNUAL_PER_MONTH,
} from "@/lib/pricing-display";
import { PRICING as BILLING } from "@/lib/plans";

const TIERS = [
  {
    name: "Free",
    monthly: 0,
    annual: 0,
    description: "Perfect for new businesses",
    features: ["Claim your listing", "Respond to reviews", "Basic analytics"],
    cta: "Start Free",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    monthly: BILLING.monthlyUsd,
    annual: RATELOCAL_PRO_ANNUAL_PER_MONTH,
    description: "Grow your reputation — matches Stripe checkout",
    features: [
      "AI review response suggestions",
      "Review request campaigns (500/mo)",
      "Advanced analytics + competitor tracking",
      "Remove ads from profile",
      "Priority listing in search",
    ],
    cta: "Start Pro Trial",
    href: "/signup?plan=pro",
    popular: true,
  },
  {
    name: "Enterprise",
    monthly: 149,
    annual: 119,
    description: "For multi-location brands",
    features: [
      "Multi-location management",
      "White-label review widgets",
      "Custom API integrations",
      "Dedicated account manager",
      "Unlimited review requests",
    ],
    cta: "Contact Sales",
    href: "/signup?plan=enterprise",
    popular: false,
  },
];

export function PricingPageContent() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="marketing-container py-16">
      <FadeInSection className="text-center">
        <h1 className="font-display text-3xl font-bold text-text md:text-5xl">
          Simple pricing for local businesses
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Join 150,000+ businesses building trust on RateLocal
        </p>
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${!annual ? "bg-primary text-white" : "text-muted"}`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${annual ? "bg-primary text-white" : "text-muted"}`}
          >
            Annual <span className="text-star">Save 20%</span>
          </button>
        </div>
      </FadeInSection>

      <StaggerChildren className="mt-12 grid gap-6 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const price =
            tier.name === "Pro"
              ? proDisplayPrice(annual)
              : annual
                ? tier.annual
                : tier.monthly;
          return (
          <StaggerItem key={tier.name}>
            <div
              className={`card-glow relative flex h-full flex-col p-6 ${
                tier.popular ? "border-primary ring-2 ring-primary/20" : ""
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h2 className="font-display text-xl font-bold text-text">{tier.name}</h2>
              <p className="mt-1 text-sm text-muted">{tier.description}</p>
              <p className="mt-4 font-display text-4xl font-bold text-text">
                ${price}
                <span className="text-lg font-normal text-muted">
                  {tier.name === "Pro" && annual ? "/mo equiv." : "/mo"}
                </span>
              </p>
              <ul className="mt-6 flex-1 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-text">
                    <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={tier.href} className="btn-primary-pill mt-6 block py-3 text-center text-sm">
                {tier.cta}
              </Link>
            </div>
          </StaggerItem>
          );
        })}
      </StaggerChildren>
      <p className="mt-8 text-center text-xs text-muted">{RATELOCAL_CHECKOUT_NOTE}</p>
    </div>
  );
}
