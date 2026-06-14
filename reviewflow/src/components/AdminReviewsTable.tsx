import Link from "next/link";
import type { AdminFeedbackRow } from "@/lib/admin-data";

export function AdminReviewsTable({
  rows,
  appUrl,
}: {
  rows: AdminFeedbackRow[];
  appUrl: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="surface-card p-12 text-center text-sm text-slate-500">
        No customer feedback yet across the platform.
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-gradient-to-r from-brand-950 to-brand-900 px-6 py-4 text-white">
        <div>
          <h2 className="font-display text-lg">All customer feedback</h2>
          <p className="mt-0.5 text-sm text-white/60">Every review from every business</p>
        </div>
        <a href="/api/admin/export/reviews" className="btn-gold px-4 py-2 text-sm">
          Export CSV
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-200/80 bg-cream text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">When</th>
              <th className="px-4 py-3 font-semibold">Business</th>
              <th className="px-4 py-3 font-semibold">Stars</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Notes</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-cream/50">
                <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                  {new Date(row.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium text-brand-950">{row.business_name}</p>
                </td>
                <td className="px-4 py-4 tabular-nums">
                  {row.star_rating ? `${row.star_rating}★` : "—"}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      row.is_private
                        ? "bg-amber-100 text-amber-900"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {row.is_private ? "Private (1–2★)" : "3★+ flow"}
                  </span>
                </td>
                <td className="max-w-xs truncate px-4 py-4 text-slate-600">
                  {row.customer_notes || row.ai_draft || "—"}
                </td>
                <td className="px-4 py-4">
                  {row.business_slug && (
                    <Link
                      href={`${appUrl}/r/${row.business_slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-mint-600 hover:underline"
                    >
                      Page
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
