"use client";

import { useMemo, useState } from "react";
import type { PublicReview, RatingBreakdown as Breakdown } from "@/lib/types";
import { RatingBreakdown } from "./RatingBreakdown";
import { ReviewCard } from "./ReviewCard";
import { AiReviewSummary } from "./AiReviewSummary";
import { StaggerChildren, StaggerItem } from "@/components/ui/StaggerChildren";

type SortOption = "recent" | "helpful" | "highest" | "lowest";

export function ReviewsSection({
  reviews: initialReviews,
  breakdown,
  aiSummary,
  aiTags,
}: {
  reviews: PublicReview[];
  breakdown: Breakdown;
  aiSummary?: string | null;
  aiTags?: string[] | null;
}) {
  const [sort, setSort] = useState<SortOption>("recent");
  const [starFilter, setStarFilter] = useState<number | undefined>();

  const reviews = useMemo(() => {
    let list = [...initialReviews];
    if (starFilter) list = list.filter((r) => r.star_rating === starFilter);

    list.sort((a, b) => {
      switch (sort) {
        case "helpful":
          return b.helpful_count - a.helpful_count;
        case "highest":
          return b.star_rating - a.star_rating;
        case "lowest":
          return a.star_rating - b.star_rating;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    return list;
  }, [initialReviews, sort, starFilter]);

  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return (
    <section className="marketing-container py-10" id="reviews">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6">
          <RatingBreakdown
            breakdown={breakdown}
            total={total}
            activeFilter={starFilter}
            onFilter={setStarFilter}
          />
          <AiReviewSummary summary={aiSummary} tags={aiTags} />
        </aside>

        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-xl font-bold text-text">
              Reviews ({reviews.length})
            </h2>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="input-field w-full sm:w-auto sm:min-w-[180px]"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          {reviews.length === 0 ? (
            <p className="text-muted">No reviews match this filter yet.</p>
          ) : (
            <StaggerChildren className="space-y-4">
              {reviews.map((review) => (
                <StaggerItem key={review.id}>
                  <ReviewCard review={review} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          )}
        </div>
      </div>
    </section>
  );
}
