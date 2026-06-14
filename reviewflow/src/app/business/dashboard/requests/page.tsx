export default function RequestReviewsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-text">Request Reviews</h1>
      <div className="card-surface p-6">
        <h2 className="font-semibold text-text">Upload customer list</h2>
        <p className="mt-1 text-sm text-muted">CSV with email or phone columns</p>
        <input type="file" accept=".csv" className="mt-4 text-sm" />
      </div>
      <div className="card-surface p-6">
        <h2 className="font-semibold text-text">Campaign templates</h2>
        <p className="mt-2 text-sm text-muted">Drip: Day 1, Day 3, Day 7 follow-up</p>
        <textarea
          className="input-field mt-4 min-h-[120px]"
          defaultValue="Hi {name}, thanks for visiting us! We'd love to hear about your experience on RateLocal: {link}"
        />
        <button type="button" className="btn-primary-pill mt-4 px-6 py-2 text-sm">Send campaign</button>
      </div>
      <div className="card-surface p-6">
        <h2 className="font-semibold text-text">Funnel</h2>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
          {[
            { label: "Sent", value: 120 },
            { label: "Opened", value: 89 },
            { label: "Clicked", value: 45 },
            { label: "Reviewed", value: 23 },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xl font-bold text-text">{s.value}</p>
              <p className="text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
