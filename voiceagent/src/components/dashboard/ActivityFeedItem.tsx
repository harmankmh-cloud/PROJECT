import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { intentTag } from "@/lib/intent-display";

export function ActivityFeedItem({
  id,
  label,
  summary,
  intent,
  createdAt,
}: {
  id: string;
  label: string;
  summary: string | null;
  intent: string | null;
  createdAt: string;
}) {
  const tag = intentTag(intent);

  return (
    <Link
      href={`/dashboard/calls/${id}`}
      className="group flex items-center gap-4 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-5 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container">
        <MaterialIcon name="call_received" className="text-on-primary-container" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-on-surface">{label}</span>
          <span className="shrink-0 text-xs font-semibold text-on-primary-container">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight ${tag.className}`}
          >
            {tag.label}
          </span>
          <span className="max-w-[150px] truncate text-sm text-slate-text">
            {summary || "Call recorded — open for details"}
          </span>
        </div>
      </div>
      <MaterialIcon
        name="chevron_right"
        className="text-outline-variant transition-colors group-hover:text-secondary"
      />
    </Link>
  );
}
