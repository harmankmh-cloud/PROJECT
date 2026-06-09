"use client";

import { motion } from "framer-motion";
import type { RatingBreakdown as Breakdown } from "@/lib/types";
import { FadeInSection } from "@/components/ui/FadeInSection";

export function RatingBreakdown({
  breakdown,
  total,
  activeFilter,
  onFilter,
}: {
  breakdown: Breakdown;
  total: number;
  activeFilter?: number;
  onFilter: (star: number | undefined) => void;
}) {
  const stars = [5, 4, 3, 2, 1] as const;

  return (
    <FadeInSection className="space-y-2">
      <h3 className="text-sm font-semibold text-text">Rating breakdown</h3>
      {stars.map((star) => {
        const count = breakdown[star];
        const pct = total > 0 ? (count / total) * 100 : 0;
        const isActive = activeFilter === star;

        return (
          <button
            key={star}
            type="button"
            onClick={() => onFilter(isActive ? undefined : star)}
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-1 text-sm transition ${
              isActive ? "bg-primary/10" : "hover:bg-surface"
            }`}
          >
            <span className="w-8 text-left text-muted">{star}★</span>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-border">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-star"
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <span className="w-8 text-right text-muted">{count}</span>
          </button>
        );
      })}
    </FadeInSection>
  );
}
