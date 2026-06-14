export default function DashboardReviewsPage() {
  const rows = [
    { date: "May 28", platform: "RateLocal", rating: 5, snippet: "Absolutely loved our dinner...", responded: true },
    { date: "May 20", platform: "Google", rating: 4, snippet: "Great food and friendly staff...", responded: false },
    { date: "May 15", platform: "RateLocal", rating: 5, snippet: "Best brunch in town...", responded: false },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-2xl font-bold text-text">Reviews</h1>
      <div className="mt-4 flex gap-2">
        {["All", "Unanswered", "Negative", "Positive"].map((f) => (
          <button key={f} type="button" className="rounded-full border border-border px-3 py-1 text-sm text-muted hover:border-primary">
            {f}
          </button>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="p-3 font-medium text-muted">Date</th>
              <th className="p-3 font-medium text-muted">Platform</th>
              <th className="p-3 font-medium text-muted">Rating</th>
              <th className="p-3 font-medium text-muted">Snippet</th>
              <th className="p-3 font-medium text-muted">Responded</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.date} className="border-b border-border">
                <td className="p-3 text-text">{r.date}</td>
                <td className="p-3 text-muted">{r.platform}</td>
                <td className="p-3">{r.rating}★</td>
                <td className="max-w-xs truncate p-3 text-muted">{r.snippet}</td>
                <td className="p-3">{r.responded ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
