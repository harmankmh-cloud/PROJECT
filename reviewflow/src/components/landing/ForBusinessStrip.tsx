import Link from "next/link";

export function ForBusinessStrip() {
  return (
    <section className="border-t border-border bg-surface/30 py-8">
      <div className="marketing-container flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <p className="text-muted">
          Already using RateLocal for Google reviews?{" "}
          <span className="text-text">Your dashboard is unchanged.</span>
        </p>
        <Link href="/dashboard" className="btn-ghost text-sm">
          Go to Dashboard →
        </Link>
      </div>
    </section>
  );
}
