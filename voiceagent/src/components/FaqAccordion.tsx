"use client";

import { useId, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";

export function FaqAccordion({ items }: { items: ReadonlyArray<{ q: string; a: string }> }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-4" role="region" aria-label="Frequently asked questions">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const headingId = `${baseId}-heading-${i}`;

        return (
          <article
            key={item.q}
            className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-white"
          >
            <h3 id={headingId} className="m-0">
              <button
                type="button"
                className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-sm font-semibold text-on-surface"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {item.q}
                <MaterialIcon
                  name="expand_more"
                  className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headingId}
              hidden={!isOpen}
              className="px-6 pb-5 text-sm leading-relaxed text-slate-text"
            >
              {item.a}
            </div>
          </article>
        );
      })}
    </div>
  );
}
