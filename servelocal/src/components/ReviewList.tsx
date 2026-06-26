import type { ProviderReview } from "@/lib/types";
import { StarRating } from "@/components/StarRating";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function AvatarBadge({ name }: { name: string }) {
  const colors = [
    "bg-amber-100 text-amber-700",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-rose-100 text-rose-700",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${colors[idx]}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}

export function ReviewList({ reviews }: { reviews: ProviderReview[] }) {
  if (reviews.length === 0) {
    return (
      <p className="rounded-[14px] border border-dashed border-border bg-surface/60 px-4 py-10 text-center text-sm text-muted">
        No reviews yet — be the first to share your experience.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="rounded-[14px] border border-border bg-surface p-5 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-start gap-3">
            <AvatarBadge name={review.reviewer_name} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-foreground">{review.reviewer_name}</p>
                <StarRating rating={review.rating} />
              </div>
              <p className="mt-0.5 text-xs text-muted">
                {new Date(review.created_at).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {review.title && (
                <p className="mt-2 font-medium text-foreground">{review.title}</p>
              )}
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{review.body}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
