"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { GoogleReviewDraft, ReviewWithResponse } from "@/lib/reviews-dashboard";

type Props = {
  businessName: string;
  unansweredProfile: ReviewWithResponse[];
  unansweredGoogle: GoogleReviewDraft[];
};

function ReviewResponseCard({
  review,
  onSaved,
}: {
  review: ReviewWithResponse;
  onSaved: (reviewId: string) => void;
}) {
  const toast = useToast();
  const [body, setBody] = useState(review.response?.body ?? "");
  const [loadingAi, setLoadingAi] = useState(false);
  const [saving, setSaving] = useState(false);

  async function suggest() {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai/owner-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewText: review.body, starRating: review.star_rating }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI failed");
      setBody(data.suggestion);
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "Could not generate suggestion");
    } finally {
      setLoadingAi(false);
    }
  }

  async function save() {
    if (!body.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/reviews/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: review.id, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      toast.show("Response published on your RateLocal profile");
      onSaved(review.id);
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card-surface p-5">
      <p className="text-sm font-medium text-text">
        {review.author_name} — {review.star_rating}★
      </p>
      <p className="mt-2 text-sm text-muted">&ldquo;{review.body}&rdquo;</p>
      <div className="mt-4 rounded-lg border border-star/20 bg-star/5 p-4">
        <p className="flex items-center gap-1 text-xs font-semibold text-star">
          <Sparkles className="h-3 w-3" /> Your public response
        </p>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="input-field mt-2 min-h-[100px]"
          placeholder="Write a friendly reply…"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={suggest}
          disabled={loadingAi}
          className="btn-ghost px-4 py-2 text-sm disabled:opacity-50"
        >
          {loadingAi ? "Generating…" : "AI suggest"}
        </button>
        <button
          type="button"
          onClick={save}
          disabled={saving || !body.trim()}
          className="btn-primary-pill px-6 py-2 text-sm disabled:opacity-50"
        >
          {saving ? "Saving…" : review.response ? "Update response" : "Publish response"}
        </button>
      </div>
    </div>
  );
}

function GoogleReplyCard({ draft }: { draft: GoogleReviewDraft }) {
  const toast = useToast();
  const reviewText = draft.ai_draft || draft.customer_notes || "";
  const [body, setBody] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  async function suggest() {
    if (!reviewText) return;
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai/owner-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewText,
          starRating: draft.star_rating ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI failed");
      setBody(data.suggestion);
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "Could not generate suggestion");
    } finally {
      setLoadingAi(false);
    }
  }

  async function copy() {
    if (!body.trim()) return;
    try {
      await navigator.clipboard.writeText(body);
      toast.show("Copied — paste into Google Business Profile");
    } catch {
      toast.show("Copy failed");
    }
  }

  return (
    <div className="card-surface p-5">
      <p className="text-sm font-medium text-text">
        {draft.customer_name || "Customer"}
        {draft.star_rating ? ` — ${draft.star_rating}★` : ""}
        <span className="ml-2 text-xs font-normal text-muted">Google review flow</span>
      </p>
      {reviewText && (
        <p className="mt-2 text-sm text-muted">&ldquo;{reviewText.slice(0, 200)}…&rdquo;</p>
      )}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="input-field mt-4 min-h-[90px]"
        placeholder="Draft a Google reply, then copy to Google Business Profile"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={suggest}
          disabled={loadingAi || !reviewText}
          className="btn-ghost px-4 py-2 text-sm disabled:opacity-50"
        >
          {loadingAi ? "Generating…" : "AI suggest"}
        </button>
        <button
          type="button"
          onClick={copy}
          disabled={!body.trim()}
          className="btn-primary-pill px-6 py-2 text-sm disabled:opacity-50"
        >
          Copy for Google
        </button>
      </div>
    </div>
  );
}

export function RespondPanel({ businessName, unansweredProfile, unansweredGoogle }: Props) {
  const [profileReviews, setProfileReviews] = useState(unansweredProfile);

  function handleSaved(reviewId: string) {
    setProfileReviews((current) => current.filter((r) => r.id !== reviewId));
  }

  const nothingToDo = profileReviews.length === 0 && unansweredGoogle.length === 0;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Your dashboard</p>
        <h1 className="font-display mt-1 text-3xl text-brand-950">Respond to reviews</h1>
        <p className="mt-2 text-sm text-stone-500">
          Publish replies on your RateLocal profile or draft Google replies for {businessName}.
        </p>
      </header>

      {nothingToDo && (
        <div className="card-surface p-6 text-sm text-muted">
          No unanswered reviews right now. New reviews appear here automatically.
        </div>
      )}

      {profileReviews.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-lg text-text">RateLocal profile reviews</h2>
          {profileReviews.map((review) => (
            <ReviewResponseCard key={review.id} review={review} onSaved={handleSaved} />
          ))}
        </section>
      )}

      {unansweredGoogle.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-lg text-text">Google review replies</h2>
          <p className="text-sm text-muted">
            These customers used your review link. Draft a reply here, then paste it in Google Business
            Profile.
          </p>
          {unansweredGoogle.map((draft) => (
            <GoogleReplyCard key={draft.id} draft={draft} />
          ))}
        </section>
      )}
    </div>
  );
}
