"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsSnapshot } from "@/lib/analytics-dashboard";

export function AnalyticsPanel({ data }: { data: AnalyticsSnapshot }) {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Your dashboard</p>
        <h1 className="font-display mt-1 text-3xl text-brand-950">Analytics</h1>
        <p className="mt-2 text-sm text-stone-500">Last 30 days — review page activity for your business.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Page views" value={data.pageViews} hint="Review link opens" />
        <StatCard label="Google clicks" value={data.googleClicks} hint="Went to Google to post" />
        <StatCard
          label="Conversion"
          value={`${data.conversionRate}%`}
          hint="Clicks ÷ page views"
        />
        <StatCard label="Reviews this month" value={data.reviewsThisMonth} hint="Customer submissions" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TrendCard title="Page views" data={data.pageViewsTrend} color="#16a34a" />
        <TrendCard title="Google clicks" data={data.googleClicksTrend} color="#2563eb" />
      </div>

      <div className="card-surface p-6">
        <h2 className="font-display text-base text-text">Other activity</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>Review drafts copied: {data.copyReviews}</li>
          <li>Private feedback / owner alerts: {data.ownerNotifications}</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint: string;
}) {
  return (
    <div className="card-surface p-6">
      <p className="text-sm text-muted">{label}</p>
      <p className="font-display mt-1 text-3xl font-bold text-text">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}

function TrendCard({
  title,
  data,
  color,
}: {
  title: string;
  data: { date: string; count: number }[];
  color: string;
}) {
  return (
    <div className="card-surface p-6">
      <h2 className="font-display text-base text-text">{title}</h2>
      <div className="mt-4 h-48">
        {data.length === 0 ? (
          <p className="text-sm text-muted">No activity yet in this period.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke={color} fill={color} fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
