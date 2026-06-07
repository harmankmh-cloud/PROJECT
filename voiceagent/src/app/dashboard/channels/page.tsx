"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

const CHANNEL_META = [
  { id: "sms", name: "SMS", desc: "Text follow-ups and two-way messaging via Twilio." },
  { id: "whatsapp", name: "WhatsApp", desc: "WhatsApp Business messaging." },
  { id: "web_chat", name: "Web Chat", desc: "Embed a chat widget that shares context with voice agents." },
] as const;

export default function ChannelsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ channels: Array<{ channel_type: string; is_active: boolean }> }>("/api/channels").then(
      (res) => {
        if (res.ok) {
          const map: Record<string, boolean> = {};
          res.data.channels.forEach((c) => {
            map[c.channel_type] = c.is_active;
          });
          setEnabled(map);
        } else {
          setError(res.error);
        }
        setLoading(false);
      }
    );
  }, []);

  async function toggleChannel(channel: string) {
    const next = !enabled[channel];
    setSaving(channel);
    setError("");

    const res = await apiFetch("/api/channels", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel_type: channel, is_active: next }),
    });

    setSaving(null);
    if (res.ok) {
      setEnabled((prev) => ({ ...prev, [channel]: next }));
    } else {
      setError(res.error);
    }
  }

  const webhookUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/omnichannel/inbound`
      : "/api/omnichannel/inbound";

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Omnichannel</h1>
      <p className="mt-1 text-slate-500">Enable SMS, WhatsApp, and web chat for your agents.</p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-4 text-sm text-slate-400">Loading channels…</p>}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {CHANNEL_META.map((ch) => (
          <div key={ch.id} className="surface-card p-6">
            <h3 className="font-semibold">{ch.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{ch.desc}</p>
            <button
              type="button"
              onClick={() => toggleChannel(ch.id)}
              disabled={saving === ch.id}
              className={`mt-4 btn-secondary text-xs ${enabled[ch.id] ? "border-teal-500 text-teal-700" : ""}`}
            >
              {saving === ch.id ? "Saving…" : enabled[ch.id] ? "Enabled" : "Enable channel"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 surface-card p-6 text-sm text-slate-600">
        <p className="font-medium text-brand-900">Webhook setup</p>
        <p className="mt-2">Point Twilio Messaging inbound webhook to:</p>
        <code className="mt-2 block rounded-lg bg-slate-50 p-3 text-xs break-all">{webhookUrl}</code>
      </div>
    </div>
  );
}
