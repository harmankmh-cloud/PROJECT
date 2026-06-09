import Link from "next/link";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

const PENDING_REVIEWS = [
  { id: "1", pro: "Mike's Plumbing", service: "Leak repair", date: "May 10, 2026" },
];

export default function ReviewsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Reviews</h1>
      <p className="mt-1 text-sm text-muted">Leave reviews for completed jobs</p>

      {PENDING_REVIEWS.length > 0 && (
        <div className="mt-6 rounded-[14px] border border-amber-400/30 bg-amber-400/5 p-5">
          <p className="font-semibold text-foreground">You have {PENDING_REVIEWS.length} review pending</p>
          <ul className="mt-4 space-y-3">
            {PENDING_REVIEWS.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-4">
                <div>
                  <p className="font-medium text-foreground">{r.pro}</p>
                  <p className="text-xs text-muted">{r.service} · {r.date}</p>
                </div>
                <Link href="/search?q=plumber">
                  <ShimmerButton size="sm">Leave Review</ShimmerButton>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-8 text-sm text-muted">Reviews you&apos;ve left will appear here.</p>
    </div>
  );
}
