export default function CompetitorsPage() {
  const competitors = [
    { name: "Riverside Bistro", rating: 4.5, reviews: 98, response: 65, score: 82 },
    { name: "Valley Kitchen", rating: 4.6, reviews: 145, response: 88, score: 89 },
    { name: "You", rating: 4.7, reviews: 128, response: 78, score: 87, isYou: true },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-text">Competitor Tracking</h1>
      <p className="text-muted">You&apos;re ahead of 2/5 competitors in response rate</p>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="p-3 text-muted">Business</th>
              <th className="p-3 text-muted">Rating</th>
              <th className="p-3 text-muted">Reviews</th>
              <th className="p-3 text-muted">Response %</th>
              <th className="p-3 text-muted">Score</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c) => (
              <tr key={c.name} className={`border-b border-border ${c.isYou ? "bg-primary/5" : ""}`}>
                <td className="p-3 font-medium text-text">{c.name}</td>
                <td className="p-3">{c.rating}★</td>
                <td className="p-3">{c.reviews}</td>
                <td className="p-3">{c.response}%</td>
                <td className="p-3 font-bold text-primary">{c.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn-ghost text-sm">+ Add competitor (up to 5)</button>
    </div>
  );
}
