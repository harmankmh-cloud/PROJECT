"use client";

import { useState } from "react";

import type { PlanKey } from "@/lib/plans";

export function SubscribeButton({
  plan,
  currentPlan,
  stripeReady,
  label,
}: {
  plan: PlanKey;
  currentPlan: string;
  stripeReady: boolean;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (currentPlan === plan) {
    return (
      <span className="mt-4 inline-block text-sm font-medium text-teal-600">Current plan</span>
    );
  }

  async function handleSubscribe() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed");
        setLoading(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No checkout URL returned");
    } catch {
      setError("Network error — try again");
    }
    setLoading(false);
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={!stripeReady || loading}
        className="btn-primary w-full text-sm disabled:opacity-50"
      >
        {loading ? "Redirecting…" : label || `Subscribe to ${plan}`}
      </button>
      {!stripeReady && (
        <p className="mt-2 text-xs text-slate-text">Stripe price IDs required in env.</p>
      )}
      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </div>
  );
}
