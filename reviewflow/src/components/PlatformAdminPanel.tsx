"use client";

import Link from "next/link";
import type { AdminBusinessRow } from "@/lib/admin-data";

type Props = {
  rows: AdminBusinessRow[];
  totals: {
    businesses: number;
    totalReviews: number;
    activePlans: number;
    trialPlans: number;
  };
  appUrl: string;
};

export function PlatformAdminPanel({ rows, totals, appUrl }: Props) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Businesses", totals.businesses],
          ["Total reviews", totals.totalReviews],
          ["Pro plans", totals.activePlans],
          ["Free trials", totals.trialPlans],
        ].map(([label, value]) => (
          <div key={label as string} className="surface-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{label}</p>
            <p className="font-display mt-1 text-3xl text-brand-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="surface-card overflow-hidden">
        <div className="border-b border-[#e8e2d9] bg-brand-950 px-6 py-4 text-white">
          <h2 className="font-display text-lg">All businesses</h2>
          <p className="mt-0.5 text-sm text-white/60">Every account on your ReviewFlow platform</p>
        </div>
        {rows.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-stone-500">No businesses yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-[#e8e2d9] bg-cream text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Business</th>
                  <th className="px-4 py-3 font-semibold">Plan</th>
                  <th className="px-4 py-3 font-semibold">Reviews</th>
                  <th className="px-4 py-3 font-semibold">This mo.</th>
                  <th className="px-4 py-3 font-semibold">Visits</th>
                  <th className="px-4 py-3 font-semibold">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e2d9]">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-cream/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-brand-950">{row.name}</p>
                      <p className="text-xs text-stone-500">{row.business_type}</p>
                    </td>
                    <td className="px-4 py-4 capitalize text-stone-600">{row.plan}</td>
                    <td className="px-4 py-4 tabular-nums">{row.reviewCount}</td>
                    <td className="px-4 py-4 tabular-nums">{row.reviewsThisMonth}</td>
                    <td className="px-4 py-4 tabular-nums">{row.pageViews}</td>
                    <td className="px-4 py-4">
                      <Link
                        href={`${appUrl}/r/${row.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-gold-600 hover:underline"
                      >
                        /r/{row.slug}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Link href="/dashboard" className="btn-ghost inline-flex px-5 py-2.5 text-sm">
        ← Back to control center
      </Link>
    </div>
  );
}
