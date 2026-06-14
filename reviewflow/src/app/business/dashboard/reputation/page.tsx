import { ReputationGauge } from "@/components/dashboard/ReputationGauge";

const METRICS = [
  { name: "Review Volume", weight: 25, score: 82, tip: "Send review requests after positive visits" },
  { name: "Avg Rating", weight: 30, score: 94, tip: "Maintain quality — address negative feedback quickly" },
  { name: "Response Rate", weight: 25, score: 78, tip: "Respond within 24 hours to boost trust" },
  { name: "Recency", weight: 20, score: 85, tip: "Steady new reviews signal an active business" },
];

export default function ReputationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="font-display text-2xl font-bold text-text">Reputation Score</h1>
      <div className="card-surface flex flex-col items-center p-8">
        <ReputationGauge score={87} />
        <p className="mt-4 text-muted">Your composite trust score across all platforms</p>
      </div>
      <div className="space-y-4">
        {METRICS.map((m) => (
          <div key={m.name} className="card-surface p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-text">{m.name} ({m.weight}%)</span>
              <span className="font-bold text-primary">{m.score}/100</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-primary" style={{ width: `${m.score}%` }} />
            </div>
            <p className="mt-2 text-sm text-muted">💡 {m.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
