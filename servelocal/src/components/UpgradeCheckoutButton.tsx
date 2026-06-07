"use client";

import { useState } from "react";

type Plan = "featured" | "premium";

export function UpgradeCheckoutButton({
  plan,
  label,
  className = "btn-gold w-full py-3.5",
}: {
  plan: Plan;
  label: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/login?next=/dashboard/pro";
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (res.status === 503) {
        window.location.href = `/contact?subject=${encodeURIComponent(`Upgrade to ${plan}`)}`;
        return;
      }
      throw new Error(data.error || "Checkout unavailable");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={checkout} disabled={loading} className={className}>
        {loading ? "Loading…" : label}
      </button>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
