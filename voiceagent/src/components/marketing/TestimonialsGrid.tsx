"use client";

import { useMemo, useState } from "react";
import { TESTIMONIALS } from "@/lib/marketing-content";

const INDUSTRIES = ["All", ...Array.from(new Set(TESTIMONIALS.map((t) => t.industry)))];

export function TestimonialsGrid() {
  const [filter, setFilter] = useState("All");
  const items = useMemo(
    () =>
      filter === "All" ? TESTIMONIALS : TESTIMONIALS.filter((t) => t.industry === filter),
    [filter]
  );

  return (
    <>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {INDUSTRIES.map((ind) => (
          <button
            key={ind}
            type="button"
            onClick={() => setFilter(ind)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === ind
                ? "bg-primary text-white"
                : "border border-border bg-surface text-muted hover:text-text"
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {items.map((t) => (
          <blockquote key={t.name} className="glass-card flex h-full flex-col p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-300">
              Illustrative example — not a real customer
            </p>
            <p className="flex-1 text-base leading-relaxed text-text">&ldquo;{t.quote}&rdquo;</p>
            <footer className="mt-4 text-sm text-muted">
              <span className="font-medium text-text">{t.name}</span>
              {" · "}
              {t.role}, {t.company}
              <span className="mt-1 block text-xs">{t.industry}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </>
  );
}
