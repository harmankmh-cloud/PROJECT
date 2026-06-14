"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ClientOnly } from "@/components/ui/ClientOnly";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { MARKETING } from "@/content/copy";

export function IndustriesSection() {
  const [selected, setSelected] = useState<string>(MARKETING.industries.chips[0]);
  const pain = MARKETING.industries.painPoints[selected as keyof typeof MARKETING.industries.painPoints];

  return (
    <section className="border-t border-border/80 py-20 md:py-28" id="industries">
      <div className="marketing-container">
        <FadeInSection className="mb-10 text-center">
          <p className="section-eyebrow mx-auto mb-4 w-fit">Industries</p>
          <h2 className="font-display text-3xl text-text md:text-4xl lg:text-[2.75rem]">
            Built for your business
          </h2>
        </FadeInSection>
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
          {MARKETING.industries.chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setSelected(chip)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                selected === chip
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "border border-border bg-white text-muted hover:border-primary/30 hover:text-text"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
        <ClientOnly
          fallback={
            pain && (
              <div className="card-glow card-surface mt-6">
                <h3 className="font-display text-xl text-text">{pain.title}</h3>
                <p className="mt-2 text-sm font-semibold text-primary">{pain.stat}</p>
              </div>
            )
          }
        >
          <AnimatePresence mode="wait">
            {pain && (
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="card-glow card-surface mt-6"
              >
                <h3 className="font-display text-xl text-text">{pain.title}</h3>
                <p className="mt-2 text-sm font-semibold text-primary">{pain.stat}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </ClientOnly>
      </div>
    </section>
  );
}
