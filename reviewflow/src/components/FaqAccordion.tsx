"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FaqAccordion({ items }: { items: ReadonlyArray<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={`surface-card overflow-hidden transition duration-200 ${
              isOpen ? "border-primary/25 shadow-md shadow-primary/5" : ""
            }`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="font-semibold text-text">{item.q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-muted transition duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`}
                aria-hidden
              />
            </button>
            {isOpen && (
              <div className="border-t border-border/80 px-5 pb-5 pt-3 text-sm leading-relaxed text-muted">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
