"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TESTIMONIALS } from "@/lib/marketing-content";
import { fadeUp, stagger } from "@/lib/motion";
import { GlowCard } from "@/components/ui/GlowCard";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function LandingTestimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const items = TESTIMONIALS.slice(0, 3);

  return (
    <section className="py-20 md:py-24" id="testimonials">
      <div className="marketing-container">
        <h2 className="font-display mb-3 text-center text-3xl text-text">
          Illustrative product scenarios
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-sm text-muted">
          Sample quotes showing possible GreetQ workflows — illustrative examples, not real
          customers or endorsements.
        </p>
        <motion.div
          ref={ref}
          className="grid gap-6 md:grid-cols-3"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          {items.map((t) => (
            <motion.div key={t.name} variants={fadeUp}>
              <GlowCard className="flex h-full flex-col">
                <p className="flex-1 text-sm leading-relaxed text-text">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600/20 text-sm font-semibold text-violet-300">
                    {initials(t.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{t.name}</p>
                    <p className="text-xs text-muted">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </footer>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
