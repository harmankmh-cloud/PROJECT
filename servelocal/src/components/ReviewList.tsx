import type { ProviderReview } from "@/lib/types";
import { StarRating } from "@/components/StarRating";

export function ReviewList({ reviews }: { reviews: ProviderReview[] }) {
  if (reviews.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
        No reviews yet — be the first to share your experience.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="surface-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-brand-950">{review.reviewer_name}</p>
            <StarRating rating={review.rating} />
          </div>
          {review.title && <p className="mt-2 font-medium text-slate-800">{review.title}</p>}
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{review.body}</p>
          <p className="mt-2 text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  );
}
