import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

/**
 * Centered empty state: icon + title + description + optional CTA.
 * Built on the RateLocal design tokens (surface card, brand pill CTA).
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}) {
  const cta = action ? (
    <span className="mt-6 inline-flex items-center justify-center rounded-pill bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:ds-focus-ring">
      {action.label}
    </span>
  ) : null;

  return (
    <div
      className={cn(
        "ds-card flex flex-col items-center justify-center px-6 py-12 text-center",
        className
      )}
    >
      <span
        className="flex h-12 w-12 items-center justify-center rounded-pill bg-brand-muted text-brand"
        aria-hidden
      >
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-text-primary">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm leading-relaxed text-text-secondary">{description}</p>
      ) : null}
      {action?.href ? (
        <a href={action.href} aria-label={action.label}>
          {cta}
        </a>
      ) : action ? (
        <button type="button" onClick={action.onClick} aria-label={action.label}>
          {cta}
        </button>
      ) : null}
    </div>
  );
}
