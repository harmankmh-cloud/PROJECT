"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { TrendChart } from "@/components/TrendChart";
import { MotionItem, MotionSection } from "@/components/ui/MotionSection";
import { DashboardListSkeleton } from "@/components/ui/DashboardPageSkeleton";
import { useToast } from "@/components/providers/ToastProvider";
import { apiFetch } from "@/lib/api-client";
import { INDUSTRY_BENCHMARKS } from "@/lib/industry-benchmarks";

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
  const { showError } = useToast();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [days, setDays] = useState(30);
  const [agentId, setAgentId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({ days: String(days) });
    if (agentId) params.set("agent_id", agentId);

    apiFetch<{ analytics: Analytics; agents: Agent[] }>(`/api/analytics?${params}`).then((res) => {
      if (!active) return;
      if (res.ok) {
        setAnalytics(res.data.analytics);
        setAgents(res.data.agents || []);
      } else {
        showError(res.error);
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [days, agentId]);

  if (loading && !analytics) {
    return <DashboardListSkeleton rows={6} />;
  }

  return (
    <div className="dashboard-container space-y-8 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-text md:text-3xl">Analytics</h1>
          <p className="mt-1 text-sm text-muted">Call volume, quality scores, and sentiment trends.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <select
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
          >
            <option value="">All agents</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </header>


      {analytics && (
        <>
          <MotionSection className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <MotionItem><StatCard label="Calls" value={analytics.total} /></MotionItem>
            <MotionItem><StatCard label="Avg quality score" value={analytics.avgScore ?? "—"} hint="0–100 AI score" /></MotionItem>
            <MotionItem><StatCard label="Containment" value={`${analytics.containmentRate}%`} /></MotionItem>
            <MotionItem><StatCard label="Transfers" value={`${analytics.transferRate}%`} /></MotionItem>
            <MotionItem><StatCard label="Minutes" value={analytics.totalMinutes} /></MotionItem>
          </MotionSection>

          <MotionSection className="grid gap-6 lg:grid-cols-2">
            <MotionItem>
              <div className="card-glow-hover rounded-xl border border-border bg-surface p-6">
                <TrendChart data={analytics.volumeTrend} valueKey="calls" label="Call volume" />
              </div>
            </MotionItem>
            <MotionItem>
              <div className="card-glow-hover rounded-xl border border-border bg-surface p-6">
                <TrendChart
                  data={analytics.volumeTrend.map((d) => ({
                    date: d.date,
                    avgScore: d.avgScore ?? 0,
                  }))}
                  valueKey="avgScore"
                  label="Quality score trend"
                />
              </div>
            </MotionItem>
          </MotionSection>

          <MotionSection className="grid gap-6 lg:grid-cols-2">
            <MotionItem>
            <div className="card-glow-hover rounded-xl border border-border bg-surface p-6">
              <h2 className="font-semibold text-text">Sentiment breakdown</h2>
              <div className="mt-4 space-y-3">
                {(["positive", "neutral", "negative"] as const).map((key) => {
                  const count = analytics.sentimentCounts[key];
                  const pct = analytics.total ? Math.round((count / analytics.total) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="mb-1 flex justify-between text-sm capitalize">
                        <span>{key}</span>
                        <span className="text-muted">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--color-bg-elevated)]">
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
            </MotionItem>

            <MotionItem>
            <div className="card-glow-hover rounded-xl border border-border bg-surface p-6">
              <h2 className="font-semibold text-text">Top caller intents</h2>
              <ul className="mt-4 space-y-2">
                {analytics.topIntents.length === 0 ? (
                  <li className="text-sm text-muted">No intents recorded yet.</li>
                ) : (
                  analytics.topIntents.map((row) => (
                    <li key={row.intent} className="flex justify-between text-sm">
                      <span className="truncate pr-4 text-text">{row.intent}</span>
                      <span className="font-medium text-muted">{row.count}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            </MotionItem>
          </MotionSection>

          <MotionSection>
            <MotionItem>
              <div className="card-glow-hover rounded-xl border border-border bg-surface p-6">
                <h2 className="font-semibold text-text">Industry benchmarks</h2>
                <p className="mt-1 text-xs text-muted">
                  Reference ranges for small-business AI receptionist programs — not customer-specific.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {Object.values(INDUSTRY_BENCHMARKS).map((bench) => {
                    let yours: number | null = null;
                    if (bench.yoursKey === "containment") yours = analytics.containmentRate;
                    if (bench.yoursKey === "quality") yours = analytics.avgScore;
                    if (bench.yoursKey === "missed") yours = analytics.transferRate;
                    if (bench.yoursKey === "answerRate") {
                      yours = analytics.total
                        ? Math.max(0, 100 - analytics.transferRate)
                        : null;
                    }
                    const lowerIsBetter = "lowerIsBetter" in bench && bench.lowerIsBetter;
                    const delta =
                      yours != null
                        ? lowerIsBetter
                          ? bench.typical - yours
                          : yours - bench.typical
                        : null;
                    const ahead = delta != null && delta >= 0;

                    return (
                      <div key={bench.label} className="rounded-lg border border-border/80 bg-bg/40 p-4">
                        <p className="text-xs text-muted">{bench.label}</p>
                        <p className="mt-2 font-display text-2xl text-text">
                          {yours != null ? `${yours}${bench.unit}` : "—"}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          Typical: {bench.typical}
                          {bench.unit}
                        </p>
                        {delta != null && analytics.total > 0 ? (
                          <p className={`mt-2 text-xs ${ahead ? "text-emerald-400" : "text-amber-400"}`}>
                            {ahead ? "At or above" : "Below"} typical
                          </p>
                        ) : (
                          <p className="mt-2 text-xs text-muted">Need more calls</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </MotionItem>
          </MotionSection>
        </>
      )}
    </div>
  );
}
