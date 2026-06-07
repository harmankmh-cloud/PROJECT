import "server-only";

type CallRow = {
  created_at: string;
  agent_id: string | null;
  sentiment: string | null;
  score: number | null;
  duration_seconds: number | null;
  transferred: boolean;
  contained: boolean | null;
  intent: string | null;
  handoff_payload?: Record<string, unknown> | null;
};

function resolveScore(call: CallRow): number | null {
  if (call.score != null) return call.score;
  const intel = call.handoff_payload?.intelligence as { score?: number } | undefined;
  return intel?.score ?? null;
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export function buildAnalytics(calls: CallRow[], days = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const filtered = calls.filter((c) => new Date(c.created_at) >= cutoff);

  const total = filtered.length;
  const transferred = filtered.filter((c) => c.transferred).length;
  const contained = filtered.filter((c) => c.contained).length;
  const totalMinutes = filtered.reduce(
    (sum, c) => sum + Math.ceil((c.duration_seconds || 0) / 60),
    0
  );

  const scores = filtered.map(resolveScore).filter((s): s is number => s != null);
  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
  for (const call of filtered) {
    const s = call.sentiment as keyof typeof sentimentCounts;
    if (s && s in sentimentCounts) sentimentCounts[s]++;
  }

  const byDay: Record<string, { calls: number; scoreSum: number; scoreCount: number }> = {};
  for (const call of filtered) {
    const key = dayKey(call.created_at);
    if (!byDay[key]) byDay[key] = { calls: 0, scoreSum: 0, scoreCount: 0 };
    byDay[key].calls++;
    const score = resolveScore(call);
    if (score != null) {
      byDay[key].scoreSum += score;
      byDay[key].scoreCount++;
    }
  }

  const volumeTrend = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date,
      calls: v.calls,
      avgScore: v.scoreCount ? Math.round(v.scoreSum / v.scoreCount) : null,
    }));

  const intentCounts: Record<string, number> = {};
  for (const call of filtered) {
    const intent = call.intent?.trim() || "unknown";
    intentCounts[intent] = (intentCounts[intent] || 0) + 1;
  }

  const topIntents = Object.entries(intentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([intent, count]) => ({ intent, count }));

  const byAgent: Record<string, number> = {};
  for (const call of filtered) {
    const id = call.agent_id || "unassigned";
    byAgent[id] = (byAgent[id] || 0) + 1;
  }

  return {
    total,
    containmentRate: total ? Math.round((contained / total) * 100) : 0,
    transferRate: total ? Math.round((transferred / total) * 100) : 0,
    totalMinutes,
    avgScore,
    sentimentCounts,
    volumeTrend,
    topIntents,
    byAgent,
  };
}
