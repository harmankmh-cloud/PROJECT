import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

const MOCK_QUOTES = [
  { id: "1", pro: "Mike's Plumbing", service: "Leak repair", amount: "$185", expires: "2d 14h", status: "pending" },
  { id: "2", pro: "Valley Electric", service: "Outlet install", amount: "$220", expires: "5d 3h", status: "pending" },
];

export default function QuotesPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Quotes</h1>
      <p className="mt-1 text-sm text-muted">Pending quotes with expiry countdown</p>

      {MOCK_QUOTES.length === 0 ? (
        <div className="mt-8 rounded-[14px] border border-dashed border-border p-10 text-center">
          <p className="text-muted">No pending quotes</p>
          <Link href="/request" className="mt-4 inline-block text-primary hover:underline">
            Post a job to get quotes →
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {MOCK_QUOTES.map((q) => (
            <li key={q.id} className="rounded-[14px] border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">{q.pro}</p>
                  <p className="text-sm text-muted">{q.service}</p>
                </div>
                <Badge variant="orange">{q.amount}</Badge>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-amber-500">Expires in {q.expires}</span>
                <Link href="/booking/demo" className="text-sm font-semibold text-primary hover:underline">
                  Accept &amp; Book →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
