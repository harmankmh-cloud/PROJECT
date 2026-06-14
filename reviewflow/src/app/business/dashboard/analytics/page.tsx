export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="font-display text-2xl font-bold text-text">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-surface p-6">
          <p className="text-sm text-muted">Profile views (30 days)</p>
          <p className="font-display text-3xl font-bold text-text">1,247</p>
          <p className="mt-1 text-sm text-success">+18% vs last month</p>
        </div>
        <div className="card-surface p-6">
          <p className="text-sm text-muted">Review volume trend</p>
          <p className="font-display text-3xl font-bold text-text">12 new</p>
          <p className="mt-1 text-sm text-muted">this month</p>
        </div>
      </div>
      <div className="card-surface p-6">
        <h2 className="font-semibold text-text">Search keywords</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>brunch abbotsford — 89 impressions</li>
          <li>farm to table — 56 impressions</li>
          <li>restaurant south fraser — 34 impressions</li>
        </ul>
      </div>
    </div>
  );
}
