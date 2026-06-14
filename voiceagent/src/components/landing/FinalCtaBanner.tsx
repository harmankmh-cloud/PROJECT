"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LANDING_COPY } from "@/lib/copy/landing";
import { fadeUp } from "@/lib/motion";
import { GlowButton } from "@/components/ui/GlowButton";

export function FinalCtaBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="relative overflow-hidden py-24">
      <div className="aurora-bg absolute inset-0 opacity-80" aria-hidden />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
        className="marketing-container relative text-center"
      >
        <h2 className="font-display text-3xl text-text md:text-4xl">
          {LANDING_COPY.finalCta.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted">{LANDING_COPY.finalCta.subhead}</p>
        <div className="mt-8 flex justify-center">
          <GlowButton href="/signup" className="px-8 py-3.5 text-base">
            {LANDING_COPY.finalCta.cta}
          </GlowButton>
        </div>
      </motion.div>
    </section>
  );
}
