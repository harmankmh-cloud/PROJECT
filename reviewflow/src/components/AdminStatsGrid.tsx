import Link from "next/link";
import type { PlatformExtendedTotals } from "@/lib/admin-data";

export function AdminStatsGrid({ totals }: { totals: PlatformExtendedTotals }) {
  const cards = [
    ["Businesses", totals.businesses, "/admin/businesses"],
    ["Reviews (all time)", totals.totalReviews, "/admin/reviews"],
    ["Reviews this month", totals.reviewsThisMonth, "/admin/reviews"],
    ["Pro plans", totals.activePlans, "/admin/revenue"],
    ["Free trials", totals.trialPlans, "/admin/businesses"],
    ["Page visits", totals.totalPageViews, "/admin/activity"],
    ["Google opened", totals.googleClicks, "/admin/activity"],
    ["Private feedback", totals.privateFeedback, "/admin/reviews?filter=private"],
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(([label, value, href]) => (
        <Link
          key={label}
          href={href}
          className="surface-card-hover block p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="font-display mt-1 text-3xl text-brand-950">{value}</p>
        </Link>
      ))}
    </div>
  );
}
