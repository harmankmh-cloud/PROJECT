"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { StaggerChildren, StaggerItem } from "@/components/ui/StaggerChildren";
import {
  RATELOCAL_CHECKOUT_NOTE,
  RATELOCAL_PRO_MONTHLY,
} from "@/lib/pricing-display";
import { PRICING as BILLING } from "@/lib/plans";

const TIERS = [
  {
    name: "Free",
    monthly: 0,
    annual: 0,
    description: "50 review requests included — no credit card needed",
    features: [
      "50 review requests",
      "QR code page",
      "Private feedback routing",
      "Basic dashboard",
    ],
    limitNote: "After 50 reviews, upgrade to Pro to keep collecting.",
    cta: "Start Free",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    monthly: BILLING.monthlyUsd,
    annual: BILLING.monthlyUsd,
    description: "Everything included — one flat price, no hidden fees",
    features: [
      "Unlimited review requests",
      "AI prompt generator",
      "QR poster download",
      "SMS & email templates",
      "Analytics dashboard",
      "Auto follow-up reminders",
      "Private feedback routing",
      "14-day money-back guarantee",
    ],
    limitNote: null,
    cta: "Get Started — $39/mo",
    href: "/signup?plan=pro",
    popular: true,
  },
];

export function PricingPageContent() {
  return (
    <div className="marketing-container py-16">
      <FadeInSection className="text-center">
        <h1 className="font-display text-3xl font-bold text-text md:text-5xl">
          Simple pricing for local businesses
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Start with 50 free reviews — then just ${RATELOCAL_PRO_MONTHLY}/mo for everything, no limits.
        </p>
      </FadeInSection>

      <StaggerChildren className="mt-12 grid gap-6 lg:grid-cols-2 lg:max-w-3xl lg:mx-auto">
        {TIERS.map((tier) => {
          const price = tier.monthly;
          return (
          <StaggerItem key={tier.name}>
            <div
              className={`card-glow relative flex h-full flex-col p-6 ${
                tier.popular ? "border-primary ring-2 ring-primary/20" : ""
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-white">
                  Everything Included
                </span>
              )}
              <h2 className="font-display text-xl font-bold text-text">{tier.name}</h2>
              <p className="mt-1 text-sm text-muted">{tier.description}</p>
              <p className="mt-4 font-display text-4xl font-bold text-text">
                ${price}
                {price > 0 && <span className="text-lg font-normal text-muted">/mo</span>}
              </p>
              <ul className="mt-6 flex-1 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-text">
                    <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              {tier.limitNote && (
                <p className="mt-4 rounded-xl bg-primary/5 px-3 py-2 text-xs text-muted">{tier.limitNote}</p>
              )}
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
