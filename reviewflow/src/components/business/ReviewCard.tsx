"use client";

import Image from "next/image";
import { useState } from "react";
import { ThumbsUp, Flag, BadgeCheck } from "lucide-react";
import type { PublicReview } from "@/lib/types";
import { StarDisplay } from "@/components/ui/StarRating";
import { OwnerResponseBox } from "./OwnerResponse";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ReviewCard({ review }: { review: PublicReview }) {
  const [expanded, setExpanded] = useState(false);
  const [helpful, setHelpful] = useState(false);
  const isLong = review.body.length > 280;
  const displayBody = expanded || !isLong ? review.body : `${review.body.slice(0, 280)}…`;

  return (
    <article className="card-glow p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {review.author_avatar_url ? (
            <Image
              src={review.author_avatar_url}
              alt=""
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            getInitials(review.author_name)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-text">{review.author_name}</span>
            {review.is_verified_visit && (
              <span className="inline-flex items-center gap-1 text-xs text-success">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified visit
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <StarDisplay value={review.star_rating} size="sm" animateOnLoad={false} />
            <span className="text-xs text-muted">{formatDate(review.created_at)}</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-text">{displayBody}</p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-sm font-medium text-primary hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {review.photos && review.photos.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {review.photos.map((url) => (
            <div key={url} className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg">
              <Image src={url} alt="" fill className="object-cover" sizes="112px" />
            </div>
          ))}
        </div>
      )}

      {review.owner_response && <OwnerResponseBox response={review.owner_response} />}

      <div className="mt-4 flex gap-4 border-t border-border pt-3">
        <button
          type="button"
          onClick={() => setHelpful(!helpful)}
          className={`flex items-center gap-1.5 text-sm transition ${
            helpful ? "text-primary" : "text-muted hover:text-text"
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
          Helpful {helpful ? review.helpful_count + 1 : review.helpful_count || ""}
        </button>
        <button type="button" className="flex items-center gap-1.5 text-sm text-muted hover:text-text">
          <Flag className="h-4 w-4" />
          Report
        </button>
      </div>
    </article>
  );
}
