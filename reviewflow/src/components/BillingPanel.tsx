"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Business, UsageSummary } from "@/lib/types";
import type { StripeConfigStatus } from "@/lib/stripe-config";
import { PLAN_LIMITS, pricingLabel } from "@/lib/plans";
import { StripeSetupChecklist } from "@/components/StripeSetupChecklist";

type Props = {
  business: Business;
  usage: UsageSummary;
  stripeStatus: StripeConfigStatus;
  success?: boolean;
  activated?: boolean;
  canceled?: boolean;
  sessionId?: string;
};

export function BillingPanel({
  business,
  usage,
  stripeStatus,
  success,
  activated,
  canceled,
  sessionId,
}: Props) {
  const [loading, setLoading] = useState<"checkout" | "portal" | "sync" | null>(null);
  const [error, setError] = useState("");
  const [syncNote, setSyncNote] = useState("");

  const isPro = usage.plan === "active";

  async function activatePro(explicitSessionId?: string) {
    setLoading("sync");
    setError("");
    setSyncNote("");
    try {
      const response = await fetch("/api/stripe/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: explicitSessionId || sessionId || undefined }),
      });
      const data = await response.json();
      if (!response.ok || !data.updated) {
        throw new Error(data.error || "Could not activate Pro plan");
      }
      window.location.href = "/dashboard/billing?activated=1";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Activation failed");
    } finally {
      setLoading(null);
    }
  }

  useEffect(() => {
    if (!success || isPro) return;
    setSyncNote("Checking your payment…");
    void activatePro(sessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, sessionId]);

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
      {success && !isPro && !activated && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Payment received — activating your Pro plan…
          {syncNote && <p className="mt-1 text-emerald-900/80">{syncNote}</p>}
        </div>
      )}
      {activated && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Pro plan is active — you now have 500 reviews per month.
        </div>
      )}
      {success && isPro && !activated && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Payment received — your Pro plan is active.
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

          {success && !isPro && error && (
            <button
              type="button"
              onClick={() => activatePro()}
              disabled={loading !== null}
              className="btn-dark w-full py-3 disabled:opacity-60"
            >
              {loading === "sync" ? "Activating…" : "Activate Pro now"}
            </button>
          )}

          {success && !isPro && error && (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Also run <code>npm run stripe:webhook</code> in a second terminal, and make sure you ran{" "}
              <code>migration-billing.sql</code> in Supabase.
            </p>
          )}

          {stripeStatus.ready && (
            <p className="text-xs text-stone-400">
              Edited <code>.env.local</code>? Run <code>npm run stop</code> then{" "}
              <code>npm run smooth</code> before testing again.
            </p>
          )}

          {!stripeStatus.ready ? (
            <StripeSetupChecklist status={stripeStatus} />
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

          {stripeStatus.ready && !stripeStatus.webhookReady && (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Payments work, but add webhook + service role so Pro activates automatically after
              checkout. Run <code>npm run stripe:webhook</code> on your Mac.
            </p>
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
