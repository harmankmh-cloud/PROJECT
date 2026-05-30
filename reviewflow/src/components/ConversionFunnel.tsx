import type { DashboardStats } from "@/lib/types";

export function ConversionFunnel({ stats }: { stats: DashboardStats }) {
  const steps = [
    { label: "QR scans", value: stats.pageViews, color: "bg-brand-800" },
    { label: "Drafts copied", value: stats.publicDrafts, color: "bg-gold-500" },
    { label: "Google opened", value: stats.googleClicks, color: "bg-emerald-500" },
    { label: "Private saved", value: stats.privateFeedback, color: "bg-rose-400" },
  ];

  const max = Math.max(...steps.map((s) => s.value), 1);
  const conversion =
    stats.pageViews > 0 ? Math.round((stats.googleClicks / stats.pageViews) * 100) : 0;

  return (
    <div className="surface-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-brand-950">Review funnel</h2>
          <p className="mt-1 text-sm text-stone-500">
            How customers move from scan to Google review
          </p>
        </div>
        <div className="rounded-xl bg-brand-950 px-4 py-2 text-center">
          <p className="text-2xl font-bold text-gold-400">{conversion}%</p>
          <p className="text-xs text-white/60">Scan → Google</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <div key={step.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-brand-950">
                {index + 1}. {step.label}
              </span>
              <span className="tabular-nums text-stone-500">{step.value}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-cream-dark">
              <div
                className={`h-full rounded-full transition-all ${step.color}`}
                style={{ width: `${Math.max((step.value / max) * 100, step.value > 0 ? 8 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
