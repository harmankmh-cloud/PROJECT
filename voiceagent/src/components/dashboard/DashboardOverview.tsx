"use client";

import Link from "next/link";
import {
  Calendar,
  Clock,
  MessageSquare,
  Phone,
  PhoneMissed,
  TrendingUp,
} from "lucide-react";
import { SetupChecklist } from "@/components/SetupChecklist";
import { Badge } from "@/components/ui/Badge";
import { GlowCard } from "@/components/ui/GlowCard";
import { CountUp } from "@/components/ui/CountUp";
import { MotionItem, MotionSection } from "@/components/ui/MotionSection";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCalls } from "@/hooks/useCalls";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import type { OrgSetupStatus } from "@/lib/org-setup-status";
import { DEMO_APPOINTMENTS, DEMO_MESSAGES } from "@/lib/demo-data";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function greeting(name?: string) {
  const h = new Date().getHours();
  const period = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  return `Good ${period}${name ? `, ${name}` : ""}`;
}

export function DashboardOverview({
  orgName,
  setup,
  isDemo = false,
}: {
  orgName?: string;
  setup?: OrgSetupStatus;
  isDemo?: boolean;
}) {
  const statsQuery = useDashboardStats();
  const callsQuery = useCalls();

  const stats = isDemo
    ? { callsToday: 12, appointmentsBooked: 3, missedCalls: 1, avgDuration: "2:14", activeAgents: 1 }
    : statsQuery.data;

  const calls = isDemo ? [] : callsQuery.data?.calls?.slice(0, 5) ?? [];
  const loading = !isDemo && (statsQuery.isLoading || callsQuery.isLoading);
  const showSetup =
    setup &&
    orgName &&
    !(setup.hasAgent && setup.hasPhoneNumber && setup.hasKnowledge && setup.hasPublishedFlow);

  return (
    <div className="dashboard-container space-y-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-text md:text-3xl">
          {greeting(orgName)}
        </h1>
      </div>

      {showSetup ? (
        <SetupChecklist orgName={orgName} {...setup} />
      ) : null}

      <MotionSection className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Calls Answered Today", value: stats?.callsToday ?? 0, icon: Phone, trend: true },
          { label: "Appointments Booked", value: stats?.appointmentsBooked ?? 0, icon: Calendar },
          {
            label: "Missed Calls",
            value: stats?.missedCalls ?? 0,
            icon: PhoneMissed,
            danger: (stats?.missedCalls ?? 0) > 0,
          },
          { label: "Avg Call Duration", value: stats?.avgDuration ?? "0:00", icon: Clock, text: true },
        ].map((card) => (
          <MotionItem key={card.label}>
            <GlowCard className="p-5 shadow-[0_0_20px_rgba(124,58,237,0.08)] hover:shadow-[0_0_28px_rgba(124,58,237,0.18)]">
              {loading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <card.icon className={`h-5 w-5 ${card.danger ? "text-danger" : "text-[var(--color-primary)]"}`} />
                    {card.trend && <TrendingUp className="h-4 w-4 text-success" />}
                  </div>
                  <p className={`mt-3 font-display text-3xl ${card.danger ? "text-danger" : "text-text"}`}>
                    {card.text ? card.value : <CountUp value={card.value as number} />}
                  </p>
                  <p className="mt-1 text-sm text-muted">{card.label}</p>
                </>
              )}
            </GlowCard>
          </MotionItem>
        ))}
      </MotionSection>

      <GlowCard className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <span className="pulse-dot" />
          <div>
            <p className="font-semibold text-text">
              {(stats?.activeAgents ?? 0) > 0 ? "GreetQ is active" : "Finish setup to go live"}
            </p>
            <p className="text-sm text-muted">
              {(stats?.activeAgents ?? 0) > 0
                ? "Your agent is ready to answer inbound calls"
                : "Configure an agent and connect a phone number"}
            </p>
          </div>
        </div>
        <Link href="/dashboard/agents" className="btn-secondary text-sm">
          Manage agents
        </Link>
      </GlowCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2" id="recent-calls">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-text">Recent calls</h2>
            <Link
              href={isDemo ? "/signup" : "/dashboard/calls"}
              className="text-sm text-primary-glow hover:underline"
            >
              View all
            </Link>
          </div>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : calls.length === 0 && !isDemo ? (
            <GlowCard className="p-8 text-center">
              <Phone className="mx-auto h-8 w-8 text-muted" />
              <p className="mt-3 font-medium text-text">No calls yet</p>
              <p className="mt-1 text-sm text-muted">
                Connect a phone number or run a sandbox test to see call logs here.
              </p>
              <Link href="/dashboard/sandbox" className="mt-4 inline-block text-sm text-primary-glow hover:underline">
                Open sandbox →
              </Link>
            </GlowCard>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-surface text-muted">
                  <tr>
                    <th className="px-4 py-3">Caller</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Summary</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(isDemo
                    ? [
                        { id: "1", from_number: "Sarah M.", duration_seconds: 192, summary: "Booked cleaning", status: "completed" },
                        { id: "2", from_number: "James K.", duration_seconds: 105, summary: "Forwarded emergency", status: "transferred" },
                      ]
                    : calls
                  ).map((call) => (
                    <tr key={call.id} className="border-b border-border transition hover:border-l-2 hover:border-l-[var(--color-primary)]">
                      <td className="px-4 py-3 text-text">{call.from_number || "Unknown"}</td>
                      <td className="px-4 py-3 text-muted">{formatDuration(call.duration_seconds || 0)}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-muted">{call.summary || "—"}</td>
                      <td className="px-4 py-3">
                        <Badge variant={call.status === "transferred" ? "accent" : "success"}>
                          {call.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div id="appointments">
            <h2 className="mb-3 font-display text-lg text-text">Today&apos;s appointments</h2>
            <GlowCard className="p-5">
              {isDemo ? (
                DEMO_APPOINTMENTS.map((a) => (
                  <div key={a.id} className="flex items-center justify-between border-b border-border py-3 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-text">{a.name}</p>
                      <p className="text-xs text-muted">{a.service}</p>
                    </div>
                    <p className="text-sm text-accent">
                      {a.day} {a.time}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center">
                  <Calendar className="mx-auto h-7 w-7 text-muted" />
                  <p className="mt-3 text-sm text-muted">
                    Bookings from live calls appear here once Google Calendar is connected.
                  </p>
                </div>
              )}
              <Link
                href={isDemo ? "/signup" : "/dashboard/appointments"}
                className="mt-3 block text-sm text-primary-glow hover:underline"
              >
                View calendar
              </Link>
            </GlowCard>
          </div>

          <div id="messages">
            <h2 className="mb-3 font-display text-lg text-text">Messages</h2>
            <GlowCard className="p-5">
              {isDemo ? (
                DEMO_MESSAGES.map((m) => (
                  <Link
                    key={m.id}
                    href={isDemo ? "/signup" : "/dashboard/messages"}
                    className="flex items-start gap-2 border-b border-border py-3 last:border-0"
                  >
                    {m.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text">{m.from}</p>
                      <p className="truncate text-xs text-muted">{m.preview}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-4 text-center">
                  <MessageSquare className="mx-auto h-7 w-7 text-muted" />
                  <p className="mt-3 text-sm text-muted">
                    SMS follow-ups and inbound texts show up after you enable channels.
                  </p>
                </div>
              )}
              <Link
                href={isDemo ? "/signup" : "/dashboard/messages"}
                className="mt-3 block text-sm text-primary-glow hover:underline"
              >
                Open messages
              </Link>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  );
}
