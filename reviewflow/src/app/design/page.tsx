"use client";

import {
  Inbox,
  MessageSquare,
  QrCode,
  Settings,
  Star,
  TrendingUp,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis } from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CommandMenu, type CommandItem } from "@/components/ui/CommandMenu";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tooltip } from "@/components/ui/Tooltip";

const TOKENS: { name: string; varName: string }[] = [
  { name: "background", varName: "--background" },
  { name: "surface", varName: "--surface" },
  { name: "surface-elevated", varName: "--surface-elevated" },
  { name: "border", varName: "--border" },
  { name: "brand", varName: "--brand" },
  { name: "brand-muted", varName: "--brand-muted" },
  { name: "accent", varName: "--accent" },
  { name: "accent-muted", varName: "--accent-muted" },
  { name: "destructive", varName: "--destructive" },
  { name: "warning", varName: "--warning" },
];

const SPARK = [4, 6, 5, 8, 7, 10, 9, 12, 11, 14];

const ACTIVITY = [
  { day: "Mon", reviews: 8 },
  { day: "Tue", reviews: 12 },
  { day: "Wed", reviews: 9 },
  { day: "Thu", reviews: 15 },
  { day: "Fri", reviews: 18 },
  { day: "Sat", reviews: 14 },
  { day: "Sun", reviews: 20 },
];

const COMMANDS: CommandItem[] = [
  { id: "dashboard", label: "Go to Dashboard", hint: "G then D", onSelect: () => {} },
  { id: "qr", label: "Create QR Code", hint: "C", onSelect: () => {} },
  { id: "reviews", label: "View Reviews", onSelect: () => {} },
  { id: "settings", label: "Open Settings", onSelect: () => {} },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="ds-h2 text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

export default function DesignShowcasePage() {
  return (
    <div className="dark min-h-screen bg-background">
      <CommandMenu items={COMMANDS} />
      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16">
        <header className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-emerald">
            Design System
          </span>
          <h1 className="ds-hero text-text-primary">RateLocal UI</h1>
          <p className="ds-body max-w-xl">
            The redesigned design-token foundation and shared components. Press
            <kbd className="mx-1 rounded-md border border-border px-1.5 py-0.5 text-xs text-text-secondary">
              ⌘K
            </kbd>
            to open the command menu.
          </p>
        </header>

        <Section title="Color Tokens">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {TOKENS.map((token) => (
              <div key={token.name} className="ds-card gap-2 p-3">
                <div
                  className="h-12 w-full rounded-lg border border-border"
                  style={{ background: `var(${token.varName})` }}
                />
                <span className="text-xs font-medium text-text-secondary">{token.name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Typography">
          <div className="ds-card gap-4">
            <p className="ds-hero text-text-primary">Hero</p>
            <p className="ds-h1 text-text-primary">Heading 1</p>
            <p className="ds-h2 text-text-primary">Heading 2</p>
            <p className="ds-body">
              Body — AI-powered QR prompts route unhappy customers privately and guide happy ones to
              Google in seconds.
            </p>
            <p className="ds-data text-2xl text-text-primary">1,284</p>
          </div>
        </Section>

        <Section title="Metric Cards">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Reviews"
              value="1,284"
              trend={{ value: "12%", direction: "up" }}
              sparkline={SPARK}
              icon={<MessageSquare className="h-4 w-4" />}
            />
            <MetricCard
              title="Average Rating"
              value="4.8"
              trend={{ value: "0.2", direction: "up" }}
              icon={<Star className="h-4 w-4" />}
              highlighted
            />
            <MetricCard
              title="QR Scans"
              value="3,902"
              trend={{ value: "4%", direction: "down" }}
              sparkline={SPARK}
              icon={<QrCode className="h-4 w-4" />}
            />
            <MetricCard
              title="Complaints Resolved"
              value="46"
              trend={{ value: "8%", direction: "up" }}
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>
        </Section>

        <Section title="Chart Card">
          <ChartCard
            title="Review Activity"
            subtitle="Reviews collected per day"
            ranges={["7D", "30D", "90D"]}
          >
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ACTIVITY} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <defs>
                    <linearGradient id="showcaseArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="var(--text-tertiary)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <RTooltip
                    contentStyle={{
                      background: "var(--surface-elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      color: "var(--text-primary)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="reviews"
                    stroke="var(--brand)"
                    strokeWidth={2}
                    fill="url(#showcaseArea)"
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </Section>

        <Section title="Status & Tooltip">
          <div className="ds-card flex flex-wrap items-center gap-3">
            <StatusBadge variant="active">Active</StatusBadge>
            <StatusBadge variant="pending">Pending</StatusBadge>
            <StatusBadge variant="error">Error</StatusBadge>
            <StatusBadge variant="neutral">Draft</StatusBadge>
            <Tooltip content="This is a design-token tooltip">
              <button
                type="button"
                className="rounded-pill bg-brand px-4 py-2 text-sm font-semibold text-white"
              >
                Hover me
              </button>
            </Tooltip>
          </div>
        </Section>

        <Section title="Empty State">
          <div className="grid gap-4 sm:grid-cols-2">
            <EmptyState
              icon={QrCode}
              title="No QR codes yet"
              description="Create your first QR code to start collecting Google reviews."
              action={{ label: "Create QR", href: "/dashboard" }}
            />
            <EmptyState
              icon={Inbox}
              title="Inbox zero"
              description="No private feedback to review right now."
              action={{ label: "Open Settings", href: "/dashboard/settings" }}
            />
          </div>
        </Section>

        <footer className="flex items-center gap-2 text-sm text-text-tertiary">
          <Settings className="h-4 w-4" aria-hidden />
          Internal design reference · RateLocal
        </footer>
      </div>
    </div>
  );
}
