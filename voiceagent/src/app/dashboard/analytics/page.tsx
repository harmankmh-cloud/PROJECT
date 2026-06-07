"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { TrendChart } from "@/components/TrendChart";
import { apiFetch } from "@/lib/api-client";

type Analytics = {
  total: number;
  containmentRate: number;
  transferRate: number;
  totalMinutes: number;
  avgScore: number | null;
  sentimentCounts: { positive: number; neutral: number; negative: number };
  volumeTrend: Array<{ date: string; calls: number; avgScore: number | null }>;
  topIntents: Array<{ intent: string; count: number }>;
};

type Agent = { id: string; name: string };

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [days, setDays] = useState(30);
  const [agentId, setAgentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({ days: String(days) });
    if (agentId) params.set("agent_id", agentId);

    apiFetch<{ analytics: Analytics; agents: Agent[] }>(`/api/analytics?${params}`).then((res) => {
      if (!active) return;
      if (res.ok) {
        setAnalytics(res.data.analytics);
        setAgents(res.data.agents || []);
        setError("");
      } else {
        setError(res.error);
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [days, agentId]);

  if (loading && !analytics) {
    return <p className="text-slate-400">Loading analytics…</p>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-brand-900">Analytics</h1>
          <p className="mt-1 text-slate-500">Call volume, quality scores, and sentiment trends.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="input-field w-auto py-2" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <select className="input-field w-auto py-2" value={agentId} onChange={(e) => setAgentId(e.target.value)}>
            <option value="">All agents</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {analytics && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Calls" value={analytics.total} />
            <StatCard label="Avg quality score" value={analytics.avgScore ?? "—"} hint="0–100 AI score" />
            <StatCard label="Containment" value={`${analytics.containmentRate}%`} />
            <StatCard label="Transfers" value={`${analytics.transferRate}%`} />
            <StatCard label="Minutes" value={analytics.totalMinutes} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="surface-card p-6">
              <TrendChart data={analytics.volumeTrend} valueKey="calls" label="Call volume" />
            </div>
            <div className="surface-card p-6">
              <TrendChart
                data={analytics.volumeTrend.map((d) => ({
                  date: d.date,
                  avgScore: d.avgScore ?? 0,
                }))}
                valueKey="avgScore"
                label="Quality score trend"
              />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="surface-card p-6">
              <h2 className="font-semibold text-brand-900">Sentiment breakdown</h2>
              <div className="mt-4 space-y-3">
                {(["positive", "neutral", "negative"] as const).map((key) => {
                  const count = analytics.sentimentCounts[key];
                  const pct = analytics.total ? Math.round((count / analytics.total) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="mb-1 flex justify-between text-sm capitalize">
                        <span>{key}</span>
                        <span className="text-slate-500">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            key === "positive"
                              ? "bg-teal-500"
                              : key === "negative"
                                ? "bg-red-400"
                                : "bg-slate-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="surface-card p-6">
              <h2 className="font-semibold text-brand-900">Top caller intents</h2>
              <ul className="mt-4 space-y-2">
                {analytics.topIntents.length === 0 ? (
                  <li className="text-sm text-slate-400">No intents recorded yet.</li>
                ) : (
                  analytics.topIntents.map((row) => (
                    <li key={row.intent} className="flex justify-between text-sm">
                      <span className="truncate pr-4">{row.intent}</span>
                      <span className="font-medium text-slate-600">{row.count}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
