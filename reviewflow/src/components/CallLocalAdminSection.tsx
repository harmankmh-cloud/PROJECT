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

export function CallLocalAdminSection({
  businessId,
  initialSettings,
}: {
  businessId: string;
  initialSettings: Settings | null;
}) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialSettings?.enabled ?? false);
  const [twilioPhone, setTwilioPhone] = useState(
    initialSettings?.twilio_phone_e164?.replace(/^\+1/, "") ?? ""
  );
  const [ringPhone, setRingPhone] = useState(
    initialSettings?.ring_phone_e164?.replace(/^\+1/, "") ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErr("");

    try {
      const response = await fetch(`/api/admin/businesses/${businessId}/calllocal`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled,
          twilioPhoneE164: twilioPhone ? `+1${twilioPhone.replace(/\D/g, "")}` : null,
          ringPhoneE164: ringPhone ? `+1${ringPhone.replace(/\D/g, "")}` : null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed");
      setMsg("CallLocal settings saved.");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="surface-card overflow-hidden">
      <div className="border-b border-slate-200/80 bg-teal-950 px-6 py-4 text-white">
        <h2 className="font-display text-lg">CallLocal (admin)</h2>
        <p className="mt-0.5 text-sm text-white/55">
          Assign Twilio number + enable missed-call SMS for this business.
        </p>
      </div>
      <div className="space-y-4 p-6">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          <span className="font-semibold">Enabled</span>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-semibold">Twilio number (E.164 without +1 in box)</span>
          <div className="flex gap-2">
            <span className="pt-3 text-slate-400">+1</span>
            <input
              value={twilioPhone}
              onChange={(e) => setTwilioPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="input-field"
              placeholder="6045550100"
            />
          </div>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-semibold">Ring phone (owner cell)</span>
          <div className="flex gap-2">
            <span className="pt-3 text-slate-400">+1</span>
            <input
              value={ringPhone}
              onChange={(e) => setRingPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="input-field"
              placeholder="6045551234"
            />
          </div>
        </label>
        <p className="text-xs text-slate-500">
          In Twilio, set this number&apos;s voice webhook to:{" "}
          <code className="rounded bg-slate-100 px-1">https://ratelocal.ca/api/twilio/voice/incoming</code>
          {" "}and SMS webhook to{" "}
          <code className="rounded bg-slate-100 px-1">/api/twilio/sms/incoming</code>
        </p>
        {err && <p className="text-sm text-rose-600">{err}</p>}
        {msg && <p className="text-sm text-emerald-700">{msg}</p>}
        <button type="submit" disabled={loading} className="btn-dark px-6 py-2.5 disabled:opacity-60">
          {loading ? "Saving…" : "Save CallLocal admin"}
        </button>
      </div>
    </form>
  );
}
