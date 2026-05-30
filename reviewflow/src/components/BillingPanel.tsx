"use client";

import { useState } from "react";
import Link from "next/link";
import type { Business, UsageSummary } from "@/lib/types";
import { PLAN_LIMITS, pricingLabel } from "@/lib/plans";

type Props = {
  business: Business;
  usage: UsageSummary;
  stripeReady: boolean;
  success?: boolean;
  canceled?: boolean;
};

export function BillingPanel({ business, usage, stripeReady, success, canceled }: Props) {
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);
  const [error, setError] = useState("");

  const isPro = usage.plan === "active";

  async function startCheckout() {
    setLoading("checkout");
    setError("");
    try {
      const response = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not start checkout");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(null);
    }
  }

  async function openPortal() {
    setLoading("portal");
    setError("");
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not open billing portal");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Portal failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Payment received — your Pro plan is activating. Refresh in a moment if status hasn&apos;t updated.
        </div>
      )}
      {canceled && (
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Checkout canceled. You can upgrade anytime.
        </div>
      )}

      <div className="surface-card overflow-hidden">
        <div className="border-b border-[#e8e2d9] bg-brand-950 px-6 py-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">ReviewFlow Pro</p>
          <h2 className="font-display mt-1 text-2xl">{pricingLabel()}</h2>
          <p className="mt-2 text-sm text-white/60">One-time setup + monthly subscription</p>
        </div>
        <div className="space-y-4 p-6">
          <ul className="space-y-2 text-sm text-stone-600">
            <li>✓ {PLAN_LIMITS.active.monthlyReviews} customer reviews per month</li>
            <li>✓ Full review history + CSV export</li>
            <li>✓ QR poster with your business name</li>
            <li>✓ AI review drafts + owner dashboard</li>
          </ul>

          <div className="rounded-xl bg-cream px-4 py-3 text-sm">
            <p className="font-medium text-brand-950">{business.name}</p>
            <p className="mt-1 text-stone-500">
              Status:{" "}
              <span className="font-semibold text-brand-950">{usage.planLabel}</span>
              {business.subscription_status && usage.plan !== "trial" && (
                <span className="text-stone-400"> ({business.subscription_status})</span>
              )}
            </p>
            <p className="mt-1 text-stone-500">
              This month: {usage.used} / {usage.limit} reviews
            </p>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          {!stripeReady ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-semibold">Stripe not configured yet</p>
              <p className="mt-1">
                Add <code className="text-xs">STRIPE_SECRET_KEY</code>,{" "}
                <code className="text-xs">STRIPE_PRICE_SETUP</code>, and{" "}
                <code className="text-xs">STRIPE_PRICE_MONTHLY</code> to{" "}
                <code className="text-xs">.env.local</code> to accept payments.
              </p>
            </div>
          ) : isPro ? (
            <button
              type="button"
              onClick={openPortal}
              disabled={loading !== null || !business.stripe_customer_id}
              className="btn-dark w-full py-3 disabled:opacity-60"
            >
              {loading === "portal" ? "Opening…" : "Manage subscription"}
            </button>
          ) : (
            <button
              type="button"
              onClick={startCheckout}
              disabled={loading !== null}
              className="btn-gold w-full py-3.5 disabled:opacity-60"
            >
              {loading === "checkout" ? "Redirecting to Stripe…" : `Upgrade — ${pricingLabel()}`}
            </button>
          )}

          <Link href="/dashboard" className="btn-ghost block w-full py-3 text-center text-sm">
            ← Back to dashboard
          </Link>
        </div>
      </div>

      <div className="surface-card p-6 text-sm text-stone-600">
        <p className="font-semibold text-brand-950">Plan limits</p>
        <ul className="mt-2 space-y-1">
          <li>Free trial: {PLAN_LIMITS.trial.monthlyReviews} reviews/month</li>
          <li>Pro (paid): {PLAN_LIMITS.active.monthlyReviews} reviews/month</li>
          <li>Canceled: new reviews blocked until reactivated</li>
        </ul>
      </div>
    </div>
  );
}
