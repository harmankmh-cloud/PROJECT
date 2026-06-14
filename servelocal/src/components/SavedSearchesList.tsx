"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SavedSearch } from "@/lib/types";

export function SavedSearchesList({ initial }: { initial: SavedSearch[] }) {
  const router = useRouter();
  const [searches, setSearches] = useState(initial);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function remove(id: string) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/saved-searches?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setSearches((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  if (searches.length === 0) {
    return (
      <div className="surface-card mt-4 p-6 text-center">
        <p className="text-slate-600">No saved searches yet.</p>
        <p className="mt-1 text-sm text-slate-500">Save a search on the directory to get email alerts when new pros join.</p>
      </div>
    );
  }

  return (
    <ul className="mt-4 space-y-3">
      {searches.map((s) => (
        <li key={s.id} className="surface-card flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <p className="font-semibold text-brand-950">{s.label}</p>
            <p className="mt-1 text-xs text-slate-500">
              Alerts {s.alerts_enabled ? "on" : "off"} · {s.email}
            </p>
          </div>
          <button
            type="button"
            disabled={loadingId === s.id}
            onClick={() => remove(s.id)}
            className="text-sm text-rose-600 hover:underline disabled:opacity-60"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
