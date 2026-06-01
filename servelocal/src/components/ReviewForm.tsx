"use client";

import { useState } from "react";

export function ReviewForm({ providerId, providerName }: { providerId: string; providerName: string }) {
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
      setError(err instanceof Error ? err.message : "Could not submit");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="surface-card p-6 text-center">
        <p className="text-2xl">✓</p>
        <p className="mt-2 font-semibold text-brand-950">Thanks for your review</p>
        <p className="mt-1 text-sm text-slate-600">We moderate reviews before they appear on {providerName}&apos;s profile.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card space-y-4 p-6">
      <h3 className="font-display text-lg text-brand-950">Leave a review</h3>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold">Your name</span>
        <input value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} className="input-field" required />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold">Rating</span>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="input-field">
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} star{n === 1 ? "" : "s"}</option>
          ))}
        </select>
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold">Headline (optional)</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Great job, on time" />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold">Your experience</span>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} className="input-field min-h-24 resize-y" required minLength={20} />
      </label>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button type="submit" disabled={loading} className="btn-dark w-full py-3 disabled:opacity-60">
        {loading ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
