"use client";

import { useState } from "react";
import type { FeedbackEvent } from "@/lib/types";
import { starsLabel } from "@/lib/defaults";

type Filter = "all" | "high" | "low";

export function FeedbackInbox({ feedback }: { feedback: FeedbackEvent[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = feedback.filter((item) => {
    const rating = item.star_rating ?? (item.experience_level === "great" ? 5 : item.experience_level === "good" ? 4 : item.experience_level === "okay" ? 3 : 2);
    if (filter === "all") return true;
    if (filter === "high") return rating >= 4;
    if (filter === "low") return rating <= 2;
    return true;
  });

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All reviews" },
    { id: "high", label: "4–5 stars" },
    { id: "low", label: "1–2 stars" },
  ];

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-[#e8e2d9] px-6 py-5">
        <h2 className="font-display text-xl text-brand-950">Customer reviews</h2>
        <p className="mt-1 text-sm text-stone-500">
          Every rating (1–5) is saved here when customers finish — good or bad
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === tab.id
                  ? "bg-brand-950 text-gold-400"
                  : "bg-cream text-stone-600 hover:bg-cream-dark"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-4xl">⭐</p>
          <p className="mt-3 font-medium text-brand-950">No reviews yet</p>
          <p className="mt-1 text-sm text-stone-500">
            Print your QR code and customers will appear here after they post.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#e8e2d9]">
          {filtered.map((item) => {
            const rating =
              item.star_rating ??
              (item.experience_level === "great"
                ? 5
                : item.experience_level === "good"
                  ? 4
                  : item.experience_level === "okay"
                    ? 3
                    : 2);

            return (
              <article key={item.id} className="px-6 py-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg tracking-wider text-gold-500">{starsLabel(rating)}</span>
                  <span className="text-xs text-stone-400">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                  <span className="rounded-full bg-cream-dark px-2 py-0.5 text-[10px] font-bold uppercase text-stone-600">
                    Google draft
                  </span>
                </div>
                {item.customer_notes && (
                  <p className="mt-3 text-sm text-stone-600">
                    <span className="font-semibold text-brand-950">Notes:</span> {item.customer_notes}
                  </p>
                )}
                {item.ai_draft && (
                  <blockquote className="mt-3 border-l-2 border-gold-500 pl-3 text-sm leading-relaxed text-stone-700">
                    {item.ai_draft}
                  </blockquote>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
