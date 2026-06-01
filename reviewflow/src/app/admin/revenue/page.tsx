import Link from "next/link";
import { getPlatformAdminData, getPlatformRevenueSummary } from "@/lib/admin-data";

export default async function AdminRevenuePage() {
  const rows = await getPlatformAdminData();
  const revenue = await getPlatformRevenueSummary(rows);

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
            Platform panel
          </p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">Revenue & plans</h1>
          <p className="mt-2 text-sm text-stone-500">
            Subscription counts on RateLocal — dollar totals live in Stripe Dashboard.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Active subscriptions", revenue.activeSubscriptions],
            ["Setup fees paid", revenue.setupFeeCount],
            ["Free trials", revenue.trialingCount],
            ["Est. MRR (USD)", `$${revenue.estimatedMrrUsd}`],
          ].map(([label, value]) => (
            <div key={label as string} className="surface-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
              <p className="font-display mt-2 text-3xl text-brand-950">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="surface-card p-4">
            <p className="text-sm text-slate-500">Past due</p>
            <p className="font-display mt-1 text-2xl text-red-600">{revenue.pastDueCount}</p>
          </div>
          <div className="surface-card p-4">
            <p className="text-sm text-slate-500">Canceled</p>
            <p className="font-display mt-1 text-2xl text-slate-600">{revenue.canceledCount}</p>
          </div>
          <div className="surface-card p-4">
            <p className="text-sm text-slate-500">Trial (no sub yet)</p>
            <p className="font-display mt-1 text-2xl text-brand-950">{revenue.freePlanCount}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-6">
          <h3 className="font-semibold text-amber-900">Stripe Dashboard</h3>
          <p className="mt-2 text-sm text-amber-800">
            Actual revenue, payouts, refunds, and invoices are in Stripe — not stored in RateLocal.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-dark px-4 py-2 text-sm"
            >
              Open Stripe Dashboard →
            </a>
            <Link href="/admin/businesses" className="btn-ghost px-4 py-2 text-sm">
              View all businesses
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
