"use client";

import { useMemo, useState } from "react";
import { ThumbsUp } from "lucide-react";
import type { ProviderReview } from "@/lib/types";
import { StarRating } from "@/components/StarRating";
import { ReviewForm } from "@/components/ReviewForm";
import { FadeUp } from "@/components/motion/FadeUp";
import { Avatar } from "@/components/ui/Avatar";

type Props = {
  reviews: ProviderReview[];
  providerId: string;
  providerName: string;
  avgRating?: number;
};

function RatingBreakdown({ reviews }: { reviews: ProviderReview[] }) {
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const total = reviews.length || 1;

  return (
    <div className="space-y-2">
      {counts.map(({ star, count }) => (
        <div key={star} className="flex items-center gap-2 text-sm">
          <span className="w-8 text-muted">{star}★</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-amber-400 transition-all"
              style={{ width: `${(count / total) * 100}%` }}
            />
          </div>
          <span className="w-6 text-right text-muted">{count}</span>
        </div>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ProviderReview }) {
  const [helpful, setHelpful] = useState(0);
  const [voted, setVoted] = useState(false);

  return (
    <li className="rounded-[14px] border border-border bg-surface p-5">
      <div className="flex items-start gap-3">
        <Avatar name={review.reviewer_name} size="sm" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-foreground">{review.reviewer_name}</p>
            <StarRating rating={review.rating} />
          </div>
          <p className="mt-1 text-xs text-muted">
            {new Date(review.created_at).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {review.title && <p className="mt-2 font-medium text-foreground">{review.title}</p>}
          <p className="mt-2 text-sm leading-relaxed text-muted">{review.body}</p>
          <button
            type="button"
            onClick={() => {
              if (!voted) {
                setHelpful((h) => h + 1);
                setVoted(true);
              }
            }}
            disabled={voted}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-primary disabled:opacity-60"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            Helpful {helpful > 0 && `(${helpful})`}
          </button>
        </div>
      </div>
    </li>
  );
}

export function ProReviewsSection({ reviews, providerId, providerName, avgRating }: Props) {
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (ratingFilter !== "all" && r.rating !== ratingFilter) return false;
      if (keyword && !r.body.toLowerCase().includes(keyword.toLowerCase())) return false;
      return true;
    });
  }, [reviews, ratingFilter, keyword]);

  return (
    <FadeUp>
      <section>
        <h2 className="font-display text-2xl font-bold text-foreground">Reviews</h2>

        {reviews.length > 0 && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[200px_1fr]">
            <div className="rounded-[14px] border border-border bg-surface p-5 text-center lg:text-left">
              <p className="font-display text-4xl font-black text-foreground">{avgRating ?? "—"}</p>
              <div className="mt-2 flex justify-center lg:justify-start">
                <StarRating rating={avgRating ?? 0} />
              </div>
              <p className="mt-1 text-sm text-muted">{reviews.length} reviews</p>
              <div className="mt-4 hidden lg:block">
                <RatingBreakdown reviews={reviews} />
              </div>
            </div>

            <div>
              <div className="mb-4 flex flex-wrap gap-3">
                <select
                  value={ratingFilter}
                  onChange={(e) =>
                    setRatingFilter(e.target.value === "all" ? "all" : Number(e.target.value))
                  }
                  className="input-focus-glow rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="all">All ratings</option>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>
                <input
                  type="search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search reviews..."
                  className="input-focus-glow flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted"
                />
              </div>

              <ul className="space-y-4">
                {filtered.length === 0 ? (
                  <p className="text-sm text-muted">No reviews match your filters.</p>
                ) : (
                  filtered.map((review) => <ReviewCard key={review.id} review={review} />)
                )}
              </ul>
            </div>
          </div>
        )}

        {reviews.length === 0 && (
          <p className="mt-4 rounded-[14px] border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
            No reviews yet — be the first to share your experience.
          </p>
        )}

        <div className="mt-8">
          <ReviewForm providerId={providerId} providerName={providerName} />
        </div>
      </section>
    </FadeUp>
  );
}
