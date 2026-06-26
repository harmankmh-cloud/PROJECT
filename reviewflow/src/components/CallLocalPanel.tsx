"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Settings = {
  enabled: boolean;
  twilio_phone_e164: string | null;
  ring_phone_e164: string | null;
  sms_template: string;
  notify_owner_on_missed: boolean;
};

type CallRow = {
  id: string;
  caller_e164: string;
  status: string;
  sms_sent_to_caller: boolean;
  created_at: string;
};

export function CallLocalPanel({
  businessName,
  reviewUrl,
  initialSettings,
  recentCalls,
  twilioConfigured,
  subscribed,
  addonPriceUsd,
}: {
  businessName: string;
  reviewUrl: string;
  initialSettings: Settings | null;
  recentCalls: CallRow[];
  twilioConfigured: boolean;
  subscribed: boolean;
  addonPriceUsd: number;
}) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialSettings?.enabled ?? false);
  const [ringPhone, setRingPhone] = useState(initialSettings?.ring_phone_e164?.replace(/^\+1/, "") ?? "");
  const [smsTemplate, setSmsTemplate] = useState(
    initialSettings?.sms_template ??
      `Sorry we missed your call at ${businessName}! Reply with what you need, or visit: ${reviewUrl}`
  );
  const [notifyOwner, setNotifyOwner] = useState(initialSettings?.notify_owner_on_missed ?? true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const twilioNumber = initialSettings?.twilio_phone_e164;
  const isLive = subscribed && enabled && twilioNumber && ringPhone;

  async function handleSubscribe() {
    setSubscribing(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/stripe/calllocal", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not start checkout");
      if (data.url) {
        window.location.href = data.url as string;
        return;
      }
      // Added to existing subscription — refresh to reflect entitlement.
      setMessage("CallLocal add-on activated.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout");
    } finally {
      setSubscribing(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/calllocal/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled,
          ringPhoneE164: ringPhone,
          smsTemplate,
          notifyOwnerOnMissed: notifyOwner,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed");
      setMessage("Saved.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="surface-card overflow-hidden">
        <div className="review-header">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-300">CallLocal</p>
          <h2 className="font-display mt-1 text-xl">Missed-call text back</h2>
          <p className="mt-1 text-sm text-white/55">
            When you miss a call, your customer gets an automatic SMS — so you don&apos;t lose the job.
          </p>
        </div>
        <div className="space-y-5 p-6">
          {!twilioConfigured && (
            <p className="alert-warning text-sm">
              CallLocal is not active on the server yet (Twilio keys missing). Contact support to enable.
            </p>
          )}

          {!subscribed && (
            <div className="rounded-xl border border-teal-300/40 bg-teal-50/60 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-700">Optional add-on</p>
              <p className="mt-1 text-lg font-semibold text-brand-950">
                Add CallLocal for ${addonPriceUsd}/mo
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Turn missed calls into texted-back customers. Added to your existing plan — cancel anytime
                from billing.
              </p>
              {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
              {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={subscribing}
                className="btn-gold mt-4 px-6 py-3 disabled:opacity-60"
              >
                {subscribing ? "Starting…" : `Add CallLocal — $${addonPriceUsd}/mo`}
              </button>
            </div>
          )}

          {subscribed && (
          <>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isLive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
              }`}
            >
              {isLive ? "Live" : "Not live yet"}
            </span>
            {twilioNumber ? (
              <span className="text-sm text-slate-600">
                Your CallLocal number:{" "}
                <strong className="text-brand-950">{twilioNumber}</strong>
              </span>
            ) : (
              <span className="text-sm text-slate-500">
                Your CallLocal phone number will appear here once we assign it (admin setup).
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="font-semibold text-brand-950">Turn on missed-call SMS</span>
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-semibold text-brand-950">Your cell — ring this first</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">+1</span>
                <input
                  value={ringPhone}
                  onChange={(e) => setRingPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="input-field"
                  placeholder="6045551234"
                  required
                />
              </div>
              <span className="text-xs text-slate-500">
                Forward your shop phone to your CallLocal number — we ring this cell for ~22 seconds, then text
                the caller if you don&apos;t answer.
              </span>
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-semibold text-brand-950">Automatic SMS (after missed call)</span>
              <textarea
                value={smsTemplate}
                onChange={(e) => setSmsTemplate(e.target.value)}
                className="input-field min-h-24 resize-y text-sm"
              />
              <span className="text-xs text-slate-500">
                Use {"{business_name}"} and {"{link}"} — link goes to your RateLocal review page.
              </span>
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={notifyOwner}
                onChange={(e) => setNotifyOwner(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span>Also text me when someone calls and I miss it</span>
            </label>

            {error && <p className="text-sm text-rose-600">{error}</p>}
            {message && <p className="text-sm text-emerald-700">{message}</p>}

            <button type="submit" disabled={loading} className="btn-gold px-6 py-3 disabled:opacity-60">
              {loading ? "Saving…" : "Save CallLocal settings"}
            </button>
          </form>
          </>
          )}
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="border-b border-slate-200/80 px-6 py-4">
          <h3 className="font-semibold text-brand-950">Recent calls</h3>
        </div>
        {recentCalls.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-500">No calls logged yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentCalls.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 text-sm">
                <span className="font-medium text-brand-950">{row.caller_e164}</span>
                <span className="capitalize text-slate-500">{row.status}</span>
                {row.sms_sent_to_caller && (
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700">SMS sent</span>
                )}
                <span className="text-xs text-slate-400">{new Date(row.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
