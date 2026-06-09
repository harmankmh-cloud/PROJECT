import Link from "next/link";
import { ReputationGauge } from "@/components/dashboard/ReputationGauge";
import { StarDisplay } from "@/components/ui/StarRating";

export default function BusinessDashboardOverview() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-text">Overview</h1>
        <p className="text-muted">Your reputation at a glance</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="card-surface flex flex-col items-center justify-center p-6 text-center">
          <p className="text-sm font-medium text-muted">Reputation Score</p>
          <ReputationGauge score={87} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Total Reviews", value: "128" },
            { label: "Avg Rating", value: "4.7★" },
            { label: "New This Month", value: "12" },
            { label: "Response Rate", value: "78%" },
          ].map((s) => (
            <div key={s.label} className="card-surface p-4">
              <p className="text-2xl font-bold text-text">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-danger/30 bg-danger-bg/30 p-4">
        <p className="font-semibold text-danger">Respond to 3 unanswered reviews</p>
        <p className="mt-1 text-sm text-muted">Quick responses improve your reputation score</p>
        <Link href="/business/dashboard/respond" className="btn-primary-pill mt-3 inline-block px-4 py-2 text-sm">
          Respond now
        </Link>
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-text">Recent reviews</h2>
        <div className="mt-4 space-y-3">
          {[
            { name: "Sarah M.", rating: 5, text: "Absolutely loved our dinner here!", responded: true },
            { name: "James K.", rating: 4, text: "Great food, parking was tricky.", responded: false },
          ].map((r) => (
            <div key={r.name} className="card-surface p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-text">{r.name}</span>
                <StarDisplay value={r.rating} size="sm" />
              </div>
              <p className="mt-2 text-sm text-muted">{r.text}</p>
              {!r.responded && (
                <span className="mt-2 inline-block text-xs font-medium text-danger">Needs response</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
