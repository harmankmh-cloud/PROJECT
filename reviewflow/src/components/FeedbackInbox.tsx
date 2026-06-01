"use client";

import { useState } from "react";
import type { FeedbackEvent } from "@/lib/types";
import { starsLabel } from "@/lib/defaults";
import { FEEDBACK_PAGE_SIZE } from "@/lib/constants";

type Filter = "all" | "high" | "mid" | "low";

type Props = {
  initialFeedback: FeedbackEvent[];
  totalCount: number;
};

function ratingOf(item: FeedbackEvent): number {
  if (item.star_rating) return item.star_rating;
  if (item.experience_level === "great") return 5;
  if (item.experience_level === "good") return 4;
  if (item.experience_level === "okay") return 3;
  return 2;
}

export function FeedbackInbox({ initialFeedback, totalCount }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [feedback, setFeedback] = useState(initialFeedback);
  const [total, setTotal] = useState(totalCount);
  const [loadingMore, setLoadingMore] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const filtered = feedback.filter((item) => {
    const rating = ratingOf(item);
    if (filter === "all") return true;
    if (filter === "high") return rating >= 4;
    if (filter === "mid") return rating === 3;
    if (filter === "low") return rating <= 2;
    return true;
  });

  const hasMore = feedback.length < total;

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "high", label: "4–5 ★" },
    { id: "mid", label: "3 ★" },
    { id: "low", label: "1–2 ★" },
  ];

  async function loadMore() {
    setLoadingMore(true);
    setError("");
    try {
      const response = await fetch(
        `/api/feedback?offset=${feedback.length}&limit=${FEEDBACK_PAGE_SIZE}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load more reviews");

      setFeedback((current) => {
        const ids = new Set(current.map((item) => item.id));
        const next = (data.feedback as FeedbackEvent[]).filter((item) => !ids.has(item.id));
        return [...current, ...next];
      });
      setTotal(data.total ?? total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load more reviews");
    } finally {
      setLoadingMore(false);
    }
  }

  async function exportCsv() {
    setExporting(true);
    setError("");
    try {
      const response = await fetch("/api/feedback/export");
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Export failed");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "reviews-export.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e8e2d9] bg-white px-6 py-4">
        <div>
          <h2 className="font-display text-lg text-brand-950">Customer reviews</h2>
          <p className="mt-0.5 text-sm text-stone-500">
            {total} total · showing {feedback.length}
          </p>
        </div>
        {total > 0 && (
          <button
            type="button"
            onClick={exportCsv}
            disabled={exporting}
            className="btn-ghost py-2 text-sm disabled:opacity-60"
          >
            {exporting ? "Exporting…" : "Export all CSV"}
          </button>
        )}
      </div>
      <div className="border-b border-[#e8e2d9] px-6 py-4">
        <div className="flex flex-wrap gap-2">
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

      {error && (
        <p className="border-b border-[#e8e2d9] bg-rose-50 px-6 py-3 text-sm text-rose-700">{error}</p>
      )}

      {filtered.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-4xl">⭐</p>
          <p className="mt-3 font-medium text-brand-950">No reviews yet</p>
          <p className="mt-1 text-sm text-stone-500">
            Print your poster or share the link to collect your first review.
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-[#e8e2d9]">
            {filtered.map((item) => {
              const rating = ratingOf(item);
              return (
                <article key={item.id} className="px-6 py-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg tracking-wider text-gold-500">{starsLabel(rating)}</span>
                    <span className="text-xs text-stone-400">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        item.is_private
                          ? "bg-rose-100 text-rose-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {item.is_private ? "Needs attention" : "Google ready"}
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
          {hasMore && (
            <div className="border-t border-[#e8e2d9] px-6 py-4 text-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="btn-ghost px-6 py-2.5 text-sm disabled:opacity-60"
              >
                {loadingMore ? "Loading…" : `Load more (${total - feedback.length} remaining)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
