import Link from "next/link";
import type { UsageSummary } from "@/lib/types";
import { PLAN_LIMITS, PRICING } from "@/lib/plans";

export function UsageMeter({ usage }: { usage: UsageSummary }) {
  const barColor =
    usage.atLimit ? "bg-rose-500" : usage.percent >= 80 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e8e2d9] bg-white px-6 py-4">
        <div>
          <h2 className="font-display text-lg text-brand-950">Monthly usage</h2>
          <p className="mt-0.5 text-sm text-stone-500">
            Plan: <span className="font-medium text-brand-950">{usage.planLabel}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-brand-950">
            {usage.used}
            <span className="text-base font-normal text-stone-400"> / {usage.limit}</span>
          </p>
          <p className="text-xs text-stone-500">reviews this month</p>
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="h-2.5 overflow-hidden rounded-full bg-cream-dark">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${Math.max(usage.percent, usage.used > 0 ? 4 : 0)}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-stone-600">
          {usage.atLimit ? (
            <>
              Limit reached.{" "}
              <Link href="/dashboard/billing" className="font-semibold text-gold-600 hover:underline">
                Upgrade to Pro
              </Link>{" "}
              for {PLAN_LIMITS.active.monthlyReviews} reviews/month (${PRICING.monthlyUsd}/mo).
            </>
          ) : (
            <>
              {usage.remaining} reviews left this month.
              {usage.plan === "trial" && (
                <>
                  {" "}
                  <Link href="/dashboard/billing" className="font-semibold text-gold-600 hover:underline">
                    Go Pro
                  </Link>{" "}
                  for ${PRICING.monthlyUsd}/mo — no setup fee.
                </>
              )}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
