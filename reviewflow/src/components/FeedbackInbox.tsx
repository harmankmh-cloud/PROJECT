"use client";

import { useState } from "react";
import type { FeedbackEvent } from "@/lib/types";
import { EXPERIENCE_OPTIONS } from "@/lib/defaults";

type Filter = "all" | "private" | "great" | "bad";

export function FeedbackInbox({ feedback }: { feedback: FeedbackEvent[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = feedback.filter((item) => {
    if (filter === "all") return true;
    if (filter === "private") return item.is_private;
    if (filter === "great") return item.experience_level === "great" || item.experience_level === "good";
    if (filter === "bad") return item.experience_level === "bad" || item.experience_level === "okay";
    return true;
  });

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "great", label: "Happy" },
    { id: "bad", label: "Needs attention" },
    { id: "private", label: "Private" },
  ];

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-[#e8e2d9] px-6 py-5">
        <h2 className="font-display text-xl text-brand-950">Feedback inbox</h2>
        <p className="mt-1 text-sm text-stone-500">Every customer response, newest first</p>
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
          <p className="text-4xl">📭</p>
          <p className="mt-3 font-medium text-brand-950">No feedback yet</p>
          <p className="mt-1 text-sm text-stone-500">
            Share your QR code or text the link from the Share kit below.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#e8e2d9]">
          {filtered.map((item) => {
            const option = EXPERIENCE_OPTIONS.find((o) => o.level === item.experience_level);
            return (
              <article key={item.id} className="px-6 py-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg">{option?.emoji || "💬"}</span>
                  <span className="text-sm font-semibold capitalize text-brand-950">
                    {option?.label || item.experience_level}
                  </span>
                  <span className="text-xs text-stone-400">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                  {item.is_private && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700">
                      Private
                    </span>
                  )}
                </div>
                {item.customer_notes && (
                  <p className="mt-3 text-sm text-stone-600">
                    <span className="font-semibold text-brand-950">They said:</span>{" "}
                    {item.customer_notes}
                  </p>
                )}
                {item.ai_draft && (
                  <blockquote className="mt-3 border-l-2 border-gold-500 pl-3 text-sm italic leading-relaxed text-stone-700">
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
