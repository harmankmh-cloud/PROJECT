"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

const MONTHLY = [
  { month: "Jan", amount: 3200 },
  { month: "Feb", amount: 4100 },
  { month: "Mar", amount: 3800 },
  { month: "Apr", amount: 5200 },
  { month: "May", amount: 4800 },
  { month: "Jun", amount: 6100 },
];

const PAYOUTS = [
  { date: "2026-06-01", amount: "$4,800.00", status: "Paid" },
  { date: "2026-05-01", amount: "$5,200.00", status: "Paid" },
];

export default function ProEarningsPage() {
  const [animated, setAnimated] = useState(false);
  const max = Math.max(...MONTHLY.map((m) => m.amount));

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-foreground">Earnings</h1>
      <p className="mt-1 text-sm text-muted">Total earned · Payout history · Tax summary</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[14px] border border-border bg-surface p-5 text-center">
          <p className="font-display text-3xl font-black text-primary">$27,200</p>
          <p className="text-xs text-muted">Total earned (YTD)</p>
        </div>
        <div className="rounded-[14px] border border-border bg-surface p-5 text-center">
          <p className="font-display text-3xl font-black text-foreground">$6,100</p>
          <p className="text-xs text-muted">This month</p>
        </div>
        <div className="rounded-[14px] border border-border bg-surface p-5 text-center">
          <p className="font-display text-3xl font-black text-foreground">$2,400</p>
          <p className="text-xs text-muted">Available to payout</p>
        </div>
      </div>

      <div className="mt-8 rounded-[14px] border border-border bg-surface p-6">
        <h2 className="font-semibold text-foreground">Monthly earnings</h2>
        <div className="mt-6 flex h-48 items-end justify-between gap-2">
          {MONTHLY.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
              <motion.div
                className="w-full rounded-t-lg bg-gradient-to-t from-amber-500 to-amber-400"
                initial={{ height: 0 }}
                animate={{ height: animated ? `${(m.amount / max) * 100}%` : 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ minHeight: animated ? 8 : 0 }}
              />
              <span className="text-xs text-muted">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <ShimmerButton size="sm">Request Payout</ShimmerButton>
        <button
          type="button"
          className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:border-amber-400/50"
        >
          Download T4A Summary
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-[14px] border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-muted">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {PAYOUTS.map((p) => (
              <tr key={p.date} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">{p.date}</td>
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
