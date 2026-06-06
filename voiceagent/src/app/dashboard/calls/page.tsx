"use client";

import { useEffect, useState } from "react";
import type { Call } from "@/lib/types";

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [stats, setStats] = useState({ total: 0, containmentRate: 0, transferRate: 0, totalMinutes: 0 });

  useEffect(() => {
    fetch("/api/calls").then((r) => r.json()).then((d) => {
      setCalls(d.calls || []);
      setStats(d.stats || {});
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Call Logs</h1>
      <p className="mt-1 text-slate-500">{stats.totalMinutes} minutes · {stats.containmentRate}% contained</p>

      <div className="mt-8 surface-card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3">Direction</th>
              <th className="px-5 py-3">From</th>
              <th className="px-5 py-3">Duration</th>
              <th className="px-5 py-3">Intent</th>
              <th className="px-5 py-3">Sentiment</th>
              <th className="px-5 py-3">Transferred</th>
              <th className="px-5 py-3">Summary</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call.id} className="border-t border-slate-100">
                <td className="px-5 py-3 capitalize">{call.direction}</td>
                <td className="px-5 py-3">{call.from_number || "—"}</td>
                <td className="px-5 py-3">{call.duration_seconds}s</td>
                <td className="px-5 py-3">{call.intent || "—"}</td>
                <td className="px-5 py-3">{call.sentiment || "—"}</td>
                <td className="px-5 py-3">{call.transferred ? "Yes" : "No"}</td>
                <td className="px-5 py-3 max-w-xs truncate">{call.summary || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
