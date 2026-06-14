"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FaqAccordion } from "@/components/FaqAccordion";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlowCard } from "@/components/ui/GlowCard";
import { PLANS, type PlanKey } from "@/lib/plans";
import { FAQ_ITEMS } from "@/lib/marketing-content";
import { TRIAL_MARKETING } from "@/lib/trial";
import { fadeUp, stagger } from "@/lib/motion";
import { Check } from "lucide-react";

const DISPLAY_PLANS: { key: PlanKey; tagline: string; popular?: boolean }[] = [
  { key: "starter", tagline: "Perfect for solo shops" },
  { key: "growth", tagline: "Best for growing businesses", popular: true },
  { key: "pro", tagline: "For multi-location teams" },
];

export function PricingPageClient() {
  const [annual, setAnnual] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  function price(monthly: number) {
    if (!annual) return monthly;
    return Math.round(monthly * 0.8);
  }

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="marketing-container">
          <div className="mb-12 text-center">
            <h1 className="font-display text-3xl text-text md:text-4xl">Simple, honest pricing</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
              Flat monthly with minutes included. Cheaper than a part-time receptionist — and yours never
              calls in sick.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-surface p-1">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${!annual ? "bg-violet-600 text-white" : "text-muted"}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${annual ? "bg-violet-600 text-white" : "text-muted"}`}
              >
                Annual
                <span className="ml-1.5 rounded-full bg-teal-500/20 px-2 py-0.5 text-xs text-teal-300">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <motion.div
            ref={ref}
            className="grid gap-6 md:grid-cols-3"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={stagger}
          >
            {DISPLAY_PLANS.map(({ key, tagline, popular }) => {
              const plan = PLANS[key];
              return (
                <motion.div key={key} variants={fadeUp} className={popular ? "md:-mt-2 md:mb-2" : ""}>
                  <GlowCard
                    className={`relative h-full ${popular ? "ring-2 ring-violet-500/50" : ""}`}
                  >
                    {popular ? (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                        Most Popular
                      </span>
                    ) : null}
                    <p className="text-sm font-semibold text-violet-400">{plan.name}</p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-4xl text-text">${price(plan.monthlyPrice)}</span>
                      <span className="text-muted">/mo</span>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {plan.includedMinutes.toLocaleString()} min included · then ${plan.perMinute}/min
                    </p>
                    <p className="mt-3 text-sm text-muted">{tagline}</p>
                    <ul className="mt-6 space-y-2 text-sm text-muted">
                      {plan.features.slice(0, 6).map((f) => (
                        <li key={f} className="flex gap-2">
                          <Check className="h-4 w-4 shrink-0 text-teal-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <GlowButton href={`/signup?plan=${key}`} className="mt-8 w-full justify-center">
                      {TRIAL_MARKETING.cta}
                    </GlowButton>
                  </GlowCard>
                </motion.div>
              );
            })}
          </motion.div>

          <GlowCard className="mx-auto mt-10 max-w-xl text-center">
            <p className="font-display text-lg text-text">Enterprise</p>
            <p className="mt-2 text-sm text-muted">
              Unlimited scale, SSO, HIPAA mode, dedicated onboarding, and custom SLAs.
            </p>
            <GlowButton href="/help?intent=enterprise" variant="ghost" className="mt-4">
              Contact sales
            </GlowButton>
          </GlowCard>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="marketing-container mx-auto max-w-3xl">
          <h2 className="font-display mb-8 text-center text-2xl text-text">Pricing FAQ</h2>
          <FaqAccordion items={FAQ_ITEMS.slice(0, 8)} />
          <div className="mt-12 text-center">
            <p className="text-muted">Still not sure?</p>
            <GlowButton href="/help?intent=demo" variant="ghost" className="mt-4">
              Book a live demo
            </GlowButton>
          </div>
        </div>
      </section>
    </>
  );
}
