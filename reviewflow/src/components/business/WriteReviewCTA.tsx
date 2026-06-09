import Link from "next/link";

export function WriteReviewCTA({ slug, businessName }: { slug: string; businessName: string }) {
  return (
    <section className="border-t border-border bg-surface/30 py-12">
      <div className="marketing-container text-center">
        <h2 className="font-display text-2xl font-bold text-text md:text-3xl">
          Share your experience
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Help others discover {businessName}. Your honest review makes a difference.
        </p>
        <Link href={`/review/new/${slug}`} className="btn-primary-pill mt-6 inline-block px-10 py-3.5">
          Write a Review
        </Link>
      </div>
    </section>
  );
}
