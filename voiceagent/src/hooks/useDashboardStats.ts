"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

type AnalyticsResponse = {
  todayCalls: number;
  volumeDelta: number | null;
  sparkline: number[];
  activeAgents: number;
};

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [callsRes, agentsRes] = await Promise.all([
        apiFetch<{ calls: Array<{ created_at: string; status: string; duration_seconds: number }> }>(
          "/api/calls"
        ),
        apiFetch<{ agents: Array<{ is_active: boolean }> }>("/api/agents"),
      ]);

      const calls = callsRes.ok ? callsRes.data.calls : [];
      const today = new Date().toISOString().slice(0, 10);
      const todayCalls = calls.filter((c) => c.created_at.startsWith(today));
      const missed = todayCalls.filter((c) => c.status === "no-answer" || c.status === "missed");
      const totalSeconds = todayCalls.reduce((s, c) => s + (c.duration_seconds || 0), 0);
      const avgSeconds = todayCalls.length ? Math.round(totalSeconds / todayCalls.length) : 0;
      const mins = Math.floor(avgSeconds / 60);
      const secs = avgSeconds % 60;

      return {
        callsToday: todayCalls.length,
        appointmentsBooked: todayCalls.filter((c) => c.status === "completed").length,
        missedCalls: missed.length,
        avgDuration: `${mins}:${secs.toString().padStart(2, "0")}`,
        activeAgents: agentsRes.ok
          ? agentsRes.data.agents.filter((a) => a.is_active).length
          : 0,
      };
    },
  });
}
