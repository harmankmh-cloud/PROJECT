"use client";

import { motion, useInView } from "framer-motion";
import { Clock, MessageCircle, Rocket } from "lucide-react";
import { useRef } from "react";
import { HOW_IT_WORKS } from "@/lib/copy/landing";
import { fadeUp, stagger } from "@/lib/motion";

const STEP_ICONS = [Clock, MessageCircle, Rocket] as const;

export function LandingHowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="border-t border-border py-20 md:py-24" id="how-it-works">
      <div className="marketing-container">
        <div className="mb-12 text-center">
          <p className="section-eyebrow mb-3">How it works</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">Live in three steps</h2>
        </div>

        <motion.div
          ref={ref}
          className="relative mx-auto max-w-2xl"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <div
            className="absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-px border-l border-dashed border-violet-500/30 md:block"
            aria-hidden
          />
          <div className="space-y-8">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <motion.div key={step.step} variants={fadeUp} className="flex gap-6">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600/20 ring-1 ring-violet-500/30">
                    <Icon className="h-5 w-5 text-violet-300" />
                  </div>
                  <div className="card-glow-hover flex-1 rounded-xl border border-border bg-surface p-6">
                    <span className="text-xs font-semibold text-violet-400">Step {step.step}</span>
                    <h3 className="mt-1 font-display text-lg text-text">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
