"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { LANDING_COPY } from "@/lib/copy/landing";
import { PLANS } from "@/lib/plans";
import { fadeUp } from "@/lib/motion";
import { GlowCard } from "@/components/ui/GlowCard";

export function PricingTeaser() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="border-t border-border py-20">
      <div className="marketing-container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          className="flex flex-col items-center gap-10 lg:flex-row lg:justify-between"
        >
          <div className="max-w-md text-center lg:text-left">
            <h2 className="font-display text-3xl text-text">{LANDING_COPY.pricingTeaser.headline}</h2>
            <p className="mt-3 text-muted">{LANDING_COPY.pricingTeaser.subhead}</p>
            <Link
              href="/pricing"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-400 transition hover:text-violet-300"
            >
              {LANDING_COPY.pricingTeaser.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <GlowCard className="w-full max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">Starter</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-4xl text-text">${PLANS.starter.monthlyPrice}</span>
              <span className="text-muted">/mo</span>
            </div>
            <p className="mt-1 text-sm text-muted">{PLANS.starter.includedMinutes} minutes included</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {PLANS.starter.features.slice(0, 4).map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-teal-400" />
                  {f}
                </li>
              ))}
            </ul>
          </GlowCard>
        </motion.div>
      </div>
    </section>
  );
}
