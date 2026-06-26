import { cn } from "@/lib/utils";

export type StatusVariant = "active" | "pending" | "error" | "neutral";

const variants: Record<StatusVariant, string> = {
  active: "bg-accent-muted text-accent-emerald",
  pending: "bg-[color-mix(in_srgb,var(--warning)_15%,transparent)] text-warning-amber",
  error: "bg-[color-mix(in_srgb,var(--destructive)_15%,transparent)] text-destructive",
  neutral: "bg-surface text-text-secondary",
};

const dotColors: Record<StatusVariant, string> = {
  active: "bg-accent-emerald",
  pending: "bg-warning-amber",
  error: "bg-destructive",
  neutral: "bg-text-tertiary",
};

/**
 * Pill-shaped status indicator built on the RateLocal design tokens.
 * Use for table/row states (e.g. Open/Resolved, Active/Draft/Completed).
 */
export function StatusBadge({
  children,
  variant = "neutral",
  withDot = true,
  className,
}: {
  children: React.ReactNode;
  variant?: StatusVariant;
  withDot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {withDot ? (
        <span className={cn("h-1.5 w-1.5 rounded-pill", dotColors[variant])} aria-hidden />
      ) : null}
      {children}
    </span>
  );
}
