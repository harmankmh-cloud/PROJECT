"use client";

import { useState } from "react";

const CHANNELS = [
  { id: "sms", name: "SMS", desc: "Text follow-ups and two-way messaging via Twilio." },
  { id: "whatsapp", name: "WhatsApp", desc: "WhatsApp Business messaging for international customers." },
  { id: "web_chat", name: "Web Chat", desc: "Embed a chat widget that shares context with voice agents." },
];

export default function ChannelsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});

  async function toggleChannel(channel: string) {
    setEnabled((prev) => ({ ...prev, [channel]: !prev[channel] }));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Omnichannel</h1>
      <p className="mt-1 text-slate-500">Extend voice agents to SMS, WhatsApp, and web chat (Phase 3).</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {CHANNELS.map((ch) => (
          <div key={ch.id} className="surface-card p-6">
            <h3 className="font-semibold">{ch.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{ch.desc}</p>
            <button
              type="button"
              onClick={() => toggleChannel(ch.id)}
              className={`mt-4 btn-secondary text-xs ${enabled[ch.id] ? "border-teal-500 text-teal-700" : ""}`}
            >
              {enabled[ch.id] ? "Enabled" : "Enable channel"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 surface-card p-6 text-sm text-slate-600">
        <p className="font-medium text-brand-900">Webhook setup</p>
        <p className="mt-2">Point Twilio Messaging inbound webhook to:</p>
        <code className="mt-2 block rounded-lg bg-slate-50 p-3 text-xs">
          {typeof window !== "undefined" ? window.location.origin : ""}/api/omnichannel/inbound
        </code>
      </div>
    </div>
  );
}
