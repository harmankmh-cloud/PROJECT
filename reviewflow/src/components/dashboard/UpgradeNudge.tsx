import Link from "next/link";
import { TrendingUp, Zap } from "lucide-react";
import type { UsageSummary } from "@/lib/types";
import { PRICING } from "@/lib/plans";

/**
 * Shows a proactive nudge when a free-plan user has used 80%+ of their
 * 50-review allowance, so they upgrade before hitting the hard limit.
 */
export function UpgradeNudge({ usage }: { usage: UsageSummary }) {
  if (usage.plan !== "trial") return null;
  if (usage.percent < 80) return null;

  const isAtLimit = usage.atLimit;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border px-6 py-5 ${
        isAtLimit
          ? "border-danger-bg bg-danger-bg"
          : "border-amber-200 bg-amber-50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isAtLimit ? "bg-danger/10 text-danger" : "bg-amber-100 text-amber-700"
          }`}
        >
          {isAtLimit ? <Zap className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`font-semibold ${isAtLimit ? "text-danger" : "text-amber-900"}`}>
            {isAtLimit
              ? "You've hit your 50-review limit"
              : `${usage.remaining} free review${usage.remaining === 1 ? "" : "s"} remaining`}
          </p>
          <p className={`mt-1 text-sm ${isAtLimit ? "text-danger/80" : "text-amber-700"}`}>
            {isAtLimit
              ? "New review requests are paused. Upgrade to Pro to keep the momentum going."
              : `You've used ${usage.used} of 50 free reviews. Upgrade before you hit the limit to keep collecting without interruption.`}
          </p>
          <Link
            href="/dashboard/billing"
            className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition ${
              isAtLimit ? "bg-danger hover:bg-danger/90" : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            Upgrade to Pro — ${PRICING.monthlyUsd}/mo
          </Link>
        </div>
        <div className="hidden text-right sm:block">
          <p className={`font-display text-2xl font-bold ${isAtLimit ? "text-danger" : "text-amber-800"}`}>
            {usage.percent}%
          </p>
          <p className={`text-xs ${isAtLimit ? "text-danger/70" : "text-amber-600"}`}>used</p>
        </div>
      </div>
      {/* Progress bar */}
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/60">
        <div
          className={`h-full rounded-full transition-all ${isAtLimit ? "bg-danger" : "bg-amber-500"}`}
          style={{ width: `${usage.percent}%` }}
        />
      </div>
    </div>
  );
}
