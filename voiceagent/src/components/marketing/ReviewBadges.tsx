import Link from "next/link";
import { Star } from "lucide-react";

export function ReviewBadges() {
  const g2Url = process.env.NEXT_PUBLIC_G2_PROFILE_URL?.trim();

  if (g2Url) {
    return (
      <a
        href={g2Url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text transition hover:border-primary/40"
      >
        <Star className="h-4 w-4 text-amber-400" />
        Read reviews on G2
      </a>
    );
  }

  return (
    <div className="text-center">
      <p className="text-sm text-muted">
        Early adopter program — independent reviews coming soon.
      </p>
      <Link
        href="/help?intent=review"
        className="mt-2 inline-block text-sm text-primary-glow hover:underline"
      >
        Share your experience
      </Link>
    </div>
  );
}
