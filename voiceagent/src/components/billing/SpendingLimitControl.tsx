"use client";

import { useState } from "react";

export function SpendingLimitControl({
  initialLimitCents,
  overageBlocked,
  subscribed,
}: {
  initialLimitCents: number | null;
  overageBlocked: boolean;
  subscribed: boolean;
}) {
  const [limitDollars, setLimitDollars] = useState(
    initialLimitCents ? String(initialLimitCents / 100) : ""
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [blocked, setBlocked] = useState(overageBlocked);

  if (!subscribed) return null;

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/billing/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spending_limit_cents: limitDollars.trim()
            ? Math.round(parseFloat(limitDollars) * 100)
            : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setBlocked(false);
      setMessage("Spending limit saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="font-medium text-ghost-white">Overage spending cap (optional)</h3>
      <p className="mt-1 text-sm text-on-surface-variant">
        Set a max overage charge per billing period. When reached, production calls pause until
        you raise the limit or the period resets. Included minutes are never blocked.
      </p>
      {blocked && (
        <p className="mt-2 text-sm text-rose-300">
          Calls are paused — overage cap reached. Raise the limit and save to resume.
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="text-on-surface-variant">Max overage ($)</span>
          <input
            type="number"
            min={0}
            step={1}
            placeholder="No limit"
            value={limitDollars}
            onChange={(e) => setLimitDollars(e.target.value)}
            className="mt-1 block w-36 rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save cap"}
        </button>
      </div>
      {message && <p className="mt-2 text-xs text-on-surface-variant">{message}</p>}
    </div>
  );
}
