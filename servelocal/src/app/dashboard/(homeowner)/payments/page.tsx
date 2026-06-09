const MOCK_PAYMENTS = [
  { id: "1", date: "2026-05-12", pro: "Mike's Plumbing", amount: "$185.00", status: "Paid" },
  { id: "2", date: "2026-04-28", pro: "Clean BC", amount: "$140.00", status: "Paid" },
];

export default function PaymentsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Payments</h1>
      <p className="mt-1 text-sm text-muted">Invoice history and receipts</p>

      <div className="mt-6 overflow-hidden rounded-[14px] border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-muted">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Pro</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PAYMENTS.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">{p.date}</td>
                <td className="px-4 py-3 text-foreground">{p.pro}</td>
                <td className="px-4 py-3 font-semibold text-foreground">{p.amount}</td>
                <td className="px-4 py-3 text-success">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
