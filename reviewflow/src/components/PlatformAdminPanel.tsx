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
  compact?: boolean;
};

export function PlatformAdminPanel({ rows, totals, appUrl, compact }: Props) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Businesses", totals.businesses, "/admin/businesses"],
          ["Total reviews", totals.totalReviews, "/admin/businesses"],
          ["Pro plans", totals.activePlans, "/admin/businesses"],
          ["Free trials", totals.trialPlans, "/admin/businesses"],
        ].map(([label, value, href]) => (
          <Link
            key={label as string}
            href={href as string}
            className="surface-card group block p-4 transition hover:border-gold-500/40 hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{label}</p>
            <p className="font-display mt-1 text-3xl text-brand-950 group-hover:text-gold-600">
              {value}
            </p>
          </Link>
        ))}
      </div>

      {!compact && (
        <div className="surface-card overflow-hidden">
          <div className="border-b border-[#e8e2d9] bg-brand-950 px-6 py-4 text-white">
            <h2 className="font-display text-lg">All businesses</h2>
            <p className="mt-0.5 text-sm text-white/60">Click scripts to edit AI for any account</p>
          </div>
          {rows.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-stone-500">No businesses yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-b border-[#e8e2d9] bg-cream text-xs uppercase tracking-wide text-stone-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Business</th>
                    <th className="px-4 py-3 font-semibold">Plan</th>
                    <th className="px-4 py-3 font-semibold">Reviews</th>
                    <th className="px-4 py-3 font-semibold">This mo.</th>
                    <th className="px-4 py-3 font-semibold">Visits</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
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
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`${appUrl}/r/${row.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-gold-600 hover:underline"
                          >
                            Page
                          </Link>
                          <Link
                            href={`/admin/business/${row.id}/prompts`}
                            className="font-semibold text-brand-950 hover:underline"
                          >
                            Scripts
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {compact && rows.length > 0 && (
        <div className="surface-card p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-stone-600">
              {rows.length} business{rows.length === 1 ? "" : "es"} on the platform
            </p>
            <Link href="/admin/businesses" className="btn-dark px-4 py-2 text-sm">
              Manage all →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
