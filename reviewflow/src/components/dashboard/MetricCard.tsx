"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useId } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

type Trend = {
  value: string;
  direction: "up" | "down";
};

/**
 * KPI metric card: title, large tabular value, optional trend badge and
 * sparkline. Built on the RateLocal design tokens (surface, rounded-2xl,
 * border, p-6). Charts animate on mount and use transform/opacity only.
 */
export function MetricCard({
  title,
  value,
  trend,
  sparkline,
  icon,
  highlighted = false,
  className,
}: {
  title: string;
  value: string;
  trend?: Trend;
  sparkline?: number[];
  icon?: React.ReactNode;
  highlighted?: boolean;
  className?: string;
}) {
  const sparkData = sparkline?.map((v, i) => ({ i, v })) ?? [];
  const trendUp = trend?.direction === "up";
  const gradientId = useId();

  return (
    <div
      className={cn(
        "ds-card flex flex-col gap-3",
        highlighted && "ds-glow-brand border-brand/40",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">{title}</span>
        {icon ? <span className="text-text-tertiary">{icon}</span> : null}
      </div>

      <div className="flex items-end justify-between gap-3">
        <span className="ds-data text-3xl text-text-primary">{value}</span>
        {trend ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-pill px-2 py-0.5 text-xs font-semibold",
              trendUp
                ? "bg-accent-muted text-accent-emerald"
                : "bg-[color-mix(in_srgb,var(--destructive)_15%,transparent)] text-destructive"
            )}
          >
            {trendUp ? (
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            ) : (
              <ArrowDownRight className="h-3 w-3" aria-hidden />
            )}
            {trend.value}
          </span>
        ) : null}
      </div>

      {sparkData.length > 1 ? (
        <div className="h-10 w-full" aria-hidden>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="var(--brand)"
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                isAnimationActive
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </div>
  );
}
