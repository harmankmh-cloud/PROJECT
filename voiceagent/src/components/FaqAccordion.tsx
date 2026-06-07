"use client";

import { useId, useState } from "react";

export function FaqAccordion({ items }: { items: ReadonlyArray<{ q: string; a: string }> }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3" role="region" aria-label="Frequently asked questions">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const headingId = `${baseId}-heading-${i}`;

        return (
          <article key={item.q} className="surface-card overflow-hidden">
            <h3 id={headingId} className="m-0">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-brand-900"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {item.q}
                <span className="text-slate-400" aria-hidden>
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headingId}
              hidden={!isOpen}
              className="border-t border-slate-100 px-5 pb-4 pt-2 text-sm leading-relaxed text-slate-600"
            >
              {item.a}
            </div>
          </article>
        );
      })}
    </div>
  );
}
