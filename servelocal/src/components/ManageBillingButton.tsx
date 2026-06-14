"use client";

import { useState } from "react";

export function ManageBillingButton({ className = "btn-ghost w-full py-3" }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function openPortal() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/login?next=/dashboard/pro";
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error(data.error || "Billing portal unavailable");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open billing portal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={openPortal} disabled={loading} className={className}>
        {loading ? "Loading…" : "Manage billing"}
      </button>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
