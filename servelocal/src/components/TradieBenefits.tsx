import Link from "next/link";
import { FOUNDING_PRO, TRADIE_COMPARISON, TRADIE_VALUE_PROPS } from "@/lib/tradie-program";

export function FoundingProBanner() {
  return (
    <div className="rounded-2xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-50 to-teal-50 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">{FOUNDING_PRO.label}</p>
          <p className="font-display mt-1 text-xl font-bold text-brand-950">
            {FOUNDING_PRO.featuredPrice} Featured — {FOUNDING_PRO.duration}
          </p>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            First {FOUNDING_PRO.spotsPerCity} pros per city get top placement + job alerts for{" "}
            {FOUNDING_PRO.featuredPrice} (regular {FOUNDING_PRO.featuredRegular}). Free Starter listing always
            available.
          </p>
        </div>
        <Link href="/join?plan=featured" className="btn-gold shrink-0 px-6 py-3 text-sm">
          Claim founding spot
        </Link>
      </div>
    </div>
  );
}

export function TradieBenefits({ showComparison = true }: { showComparison?: boolean }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {TRADIE_VALUE_PROPS.map((item) => (
          <div key={item.title} className="surface-card flex gap-4 p-5">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-semibold text-brand-950">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
      {showComparison && (
        <div>
          <h2 className="font-display text-lg font-bold text-brand-950">Why tradies switch</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Platform</th>
                  <th className="px-4 py-3">Typical cost</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Catch</th>
                </tr>
              </thead>
              <tbody>
                {TRADIE_COMPARISON.map((row, i) => (
                  <tr
                    key={row.name}
                    className={i === TRADIE_COMPARISON.length - 1 ? "bg-teal-50/80" : "border-t border-slate-100"}
                  >
                    <td className="px-4 py-3 font-medium text-brand-950">{row.name}</td>
                    <td className="px-4 py-3 text-slate-700">{row.cost}</td>
                    <td className="hidden px-4 py-3 text-slate-500 sm:table-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
