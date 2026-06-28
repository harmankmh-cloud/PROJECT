import Link from "next/link";

type StatusState = "operational" | "unknown";

/** Footer status pill — links to /status. Reflects whether an external monitor is configured. */
export function StatusBadge({ locale = "en" }: { locale?: "en" | "fr" }) {
  const hasMonitor = Boolean(process.env.NEXT_PUBLIC_STATUS_PAGE_URL?.trim());
  const state: StatusState = hasMonitor ? "operational" : "unknown";
  const label =
    state === "operational"
      ? locale === "fr"
        ? "Tous les systèmes sont opérationnels"
        : "All systems operational"
      : locale === "fr"
        ? "État du système"
        : "System status";
  const dotClass = state === "operational" ? "bg-success" : "bg-muted";

  return (
    <Link
      href="/status"
      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted transition hover:border-violet-500/40 hover:text-text"
    >
      <span className={`h-2 w-2 rounded-full ${dotClass}`} aria-hidden />
      {label}
    </Link>
  );
}
