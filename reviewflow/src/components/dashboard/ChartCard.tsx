"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type ChartRange = "7D" | "30D" | "90D";

/**
 * Chart container: title, subtitle, optional time-range toggle, and chart
 * slot. Built on the RateLocal design tokens (surface, rounded-2xl, border,
 * p-6). The toggle is uncontrolled by default but can be controlled via
 * `range`/`onRangeChange`.
 */
export function ChartCard({
  title,
  subtitle,
  ranges,
  range,
  onRangeChange,
  action,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  ranges?: ChartRange[];
  range?: ChartRange;
  onRangeChange?: (range: ChartRange) => void;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const [internal, setInternal] = useState<ChartRange>(range ?? ranges?.[0] ?? "30D");
  const active = range ?? internal;

  const select = (next: ChartRange) => {
    if (onRangeChange) onRangeChange(next);
    else setInternal(next);
  };

  return (
    <div className={cn("ds-card flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-text-primary">{title}</h3>
          {subtitle ? (
            <p className="mt-0.5 text-sm text-text-secondary">{subtitle}</p>
          ) : null}
        </div>

        {ranges?.length ? (
          <div
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-0.5"
            role="group"
            aria-label="Select time range"
          >
            {ranges.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => select(r)}
                aria-pressed={active === r}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ds-focus-ring",
                  active === r
                    ? "bg-surface-elevated text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        ) : (
          action
        )}
      </div>

      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
