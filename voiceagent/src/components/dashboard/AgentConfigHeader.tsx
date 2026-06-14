"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";

export function AgentConfigHeader({
  title,
  backHref = "/dashboard/agents",
  onSave,
  saving = false,
  saveLabel = "Save",
}: {
  title: string;
  backHref?: string;
  onSave?: () => void;
  saving?: boolean;
  saveLabel?: string;
}) {
  const router = useRouter();

  return (
    <div className="sticky top-16 z-40 -mx-5 border-b border-glass-border-subtle bg-obsidian/90 backdrop-blur-xl md:-mx-10 lg:-mx-12">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(backHref)}
            className="-ml-2 rounded-full p-2 transition-colors hover:bg-surface-container-high active:scale-95"
            aria-label="Go back"
          >
            <MaterialIcon name="arrow_back" className="text-on-surface" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-on-surface">{title}</h1>
        </div>
        {onSave ? (
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/10 active:scale-95 disabled:opacity-50"
          >
            {saving ? "Saving…" : saveLabel}
          </button>
        ) : (
          <Link
            href={backHref}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/10"
          >
            Done
          </Link>
        )}
      </div>
    </div>
  );
}
