"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ClientOnly } from "@/components/ui/ClientOnly";
import { MARKETING } from "@/content/copy";

export function IndustriesSection() {
  const [selected, setSelected] = useState<string>(MARKETING.industries.chips[0]);
  const pain = MARKETING.industries.painPoints[selected as keyof typeof MARKETING.industries.painPoints];

  return (
    <section className="border-t border-border py-20 md:py-24" id="industries">
      <div className="marketing-container">
        <div className="mb-8 text-center">
          <p className="section-eyebrow mb-3">Industries</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">Built for your business</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4">
          {MARKETING.industries.chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setSelected(chip)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                selected === chip
                  ? "bg-primary text-white shadow-md"
                  : "border border-border bg-white text-muted hover:text-text"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
        <ClientOnly
          fallback={
            pain && (
              <div className="card-surface mt-6">
                <h3 className="font-display text-xl text-text">{pain.title}</h3>
                <p className="mt-2 text-sm text-primary">{pain.stat}</p>
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
                className="card-surface mt-6"
              >
                <h3 className="font-display text-xl text-text">{pain.title}</h3>
                <p className="mt-2 text-sm font-medium text-primary">{pain.stat}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </ClientOnly>
      </div>
    </section>
  );
}
