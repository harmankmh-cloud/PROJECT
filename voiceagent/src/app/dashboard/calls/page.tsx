"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Call } from "@/lib/types";
import { apiFetch } from "@/lib/api-client";

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [stats, setStats] = useState({ total: 0, containmentRate: 0, transferRate: 0, totalMinutes: 0 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch<{ calls: Call[]; stats: typeof stats }>("/api/calls").then((res) => {
      if (!active) return;
      if (res.ok) {
        setCalls(res.data.calls || []);
        setStats(res.data.stats || { total: 0, containmentRate: 0, transferRate: 0, totalMinutes: 0 });
      } else {
        setError(res.error);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ghost-white">Call Logs</h1>
      <p className="mt-1 text-on-surface-variant">{stats.totalMinutes} minutes · {stats.containmentRate}% contained</p>
      {error && <p className="mt-4 text-sm text-error">{error}</p>}
      {loading && <p className="mt-4 text-sm text-slate-text">Loading calls…</p>}

      <div className="mt-8 surface-card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container text-on-surface-variant">
            <tr>
              <th className="px-5 py-3">Direction</th>
              <th className="px-5 py-3">From / Detail</th>
              <th className="px-5 py-3">Duration</th>
              <th className="px-5 py-3">Score</th>
              <th className="px-5 py-3">Intent</th>
              <th className="px-5 py-3">Sentiment</th>
              <th className="px-5 py-3">Transferred</th>
              <th className="px-5 py-3">Summary</th>
            </tr>
          </thead>
          <tbody>
            {calls.length === 0 && !loading ? (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-slate-text">No calls yet.</td></tr>
            ) : (
              calls.map((call) => (
                <tr key={call.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 capitalize">{call.direction}</td>
                  <td className="px-5 py-3">
                    <Link href={`/dashboard/calls/${call.id}`} className="text-teal-700 hover:underline">
                      {call.from_number || "View call"}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{call.duration_seconds}s</td>
                  <td className="px-5 py-3">{call.score ?? "—"}</td>
                  <td className="px-5 py-3">{call.intent || "—"}</td>
                  <td className="px-5 py-3">{call.sentiment || "—"}</td>
                  <td className="px-5 py-3">{call.transferred ? "Yes" : "No"}</td>
                  <td className="px-5 py-3 max-w-xs truncate">{call.summary || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
