"use client";

import { useState } from "react";
import { formatSubmitError } from "@/lib/form-utils";

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:rounded"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="transition-colors duration-100"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118L10 15.347l-3.952 2.878c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"
              fill={star <= active ? "#f59e0b" : "transparent"}
              stroke={star <= active ? "#f59e0b" : "#d1d5db"}
              strokeWidth="1.5"
            />
          </svg>
        </button>
      ))}
      {active > 0 && (
        <span className="ml-2 text-sm font-medium text-muted">
          {RATING_LABELS[active]}
        </span>
      )}
    </div>
  );
}

export function ReviewForm({
  providerId,
  providerName,
}: {
  providerId: string;
  providerName: string;
}) {
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId, reviewerName, rating, title, body }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit");
      setDone(true);
    } catch (err) {
      setError(
        formatSubmitError(
          err instanceof Error ? err.message : "Could not submit",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-[14px] border border-border bg-surface p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="mt-3 font-display text-lg font-bold text-foreground">
          Thanks for your review!
        </p>
        <p className="mt-1 text-sm text-muted">
          We moderate reviews before they appear on {providerName}&apos;s
          profile.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[14px] border border-border bg-surface p-6 space-y-5"
    >
      <div>
        <h3 className="font-display text-lg font-bold text-foreground">
          Leave a review
        </h3>
        <p className="mt-0.5 text-sm text-muted">
          Share your experience with {providerName}
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground">
          Your name
        </label>
        <input
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          className="input-field"
          placeholder="Jane Smith"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground">Rating</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground">
          Headline{" "}
          <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          placeholder="Great job, arrived on time"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground">
          Your experience
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="input-field min-h-28 resize-y"
          placeholder="Tell others what made this pro stand out…"
          required
          minLength={20}
        />
        <p className="text-xs text-muted">Minimum 20 characters</p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-950/30"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-dark w-full py-3 disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
