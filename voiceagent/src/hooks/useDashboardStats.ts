"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { extractBookingsFromCalls } from "@/lib/call-bookings";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const callsRes = await apiFetch<{
        calls: Array<{
          id: string;
          created_at: string;
          status: string;
          duration_seconds: number;
          summary?: string | null;
          intent?: string | null;
          from_number?: string | null;
          started_at?: string | null;
        }>;
      }>("/api/calls");
      const agentsRes = await apiFetch<{ agents: Array<{ is_active: boolean }> }>("/api/agents");

      const calls = callsRes.ok ? callsRes.data.calls : [];
      const today = new Date().toISOString().slice(0, 10);
      const todayCalls = calls.filter((c) => c.created_at.startsWith(today));
      const missed = todayCalls.filter((c) => c.status === "no-answer" || c.status === "missed");
      const totalSeconds = todayCalls.reduce((s, c) => s + (c.duration_seconds || 0), 0);
      const avgSeconds = todayCalls.length ? Math.round(totalSeconds / todayCalls.length) : 0;
      const mins = Math.floor(avgSeconds / 60);
      const secs = avgSeconds % 60;

      const todayBookings = extractBookingsFromCalls(calls).filter((b) =>
        b.when.startsWith(today)
      );

      return {
        callsToday: todayCalls.length,
        appointmentsBooked: todayBookings.length,
        missedCalls: missed.length,
        avgDuration: `${mins}:${secs.toString().padStart(2, "0")}`,
        activeAgents: agentsRes.ok
          ? agentsRes.data.agents.filter((a) => a.is_active).length
          : 0,
      };
    },
  });
}
