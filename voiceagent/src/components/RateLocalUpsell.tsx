import Link from "next/link";

export function RateLocalUpsell() {
  const url = process.env.NEXT_PUBLIC_RATELOCAL_URL;
  if (!url) return null;

  return (
    <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
      <div>
        <p className="text-sm font-semibold text-ghost-white">Also run RateLocal?</p>
        <p className="mt-1 text-sm text-on-surface-variant">
          Collect Google reviews with QR codes — pairs well with GreetQ phone agents.
        </p>
      </div>
      <Link href={url} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
        Open RateLocal →
      </Link>
    </div>
  );
}
