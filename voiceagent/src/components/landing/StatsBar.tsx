"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LANDING_COPY } from "@/lib/copy/landing";
import { fadeUp, stagger } from "@/lib/motion";
import { InViewCountUp } from "@/components/ui/InViewCountUp";

export function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="border-y border-border bg-surface/30 py-14">
      <motion.div
        ref={ref}
        className="marketing-container grid grid-cols-2 gap-8 md:grid-cols-4"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
      >
        {LANDING_COPY.stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <InViewCountUp
              value={stat.value}
              suffix={stat.suffix}
              decimals={"decimals" in stat ? stat.decimals : undefined}
              label={stat.label}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
