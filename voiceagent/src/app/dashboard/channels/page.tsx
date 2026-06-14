"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/providers/ToastProvider";
import { apiFetch } from "@/lib/api-client";

const CHANNEL_META = [
  { id: "sms", name: "SMS", desc: "Text follow-ups and two-way messaging via Twilio." },
  { id: "whatsapp", name: "WhatsApp", desc: "WhatsApp Business messaging." },
  { id: "web_chat", name: "Web Chat", desc: "Coming soon — embeddable chat widget for your site." },
] as const;

export default function ChannelsPage() {
  const { showError } = useToast();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [webhookUrl] = useState(() =>
    typeof window !== "undefined"
      ? `${window.location.origin}/api/omnichannel/inbound`
      : "/api/omnichannel/inbound"
  );

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
          showError(res.error);
        }
        setLoading(false);
      }
    );
  }, []);

  async function toggleChannel(channel: string) {
    const next = !enabled[channel];
    setSaving(channel);

    const res = await apiFetch("/api/channels", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel_type: channel, is_active: next }),
    });

    setSaving(null);
    if (res.ok) {
      setEnabled((prev) => ({ ...prev, [channel]: next }));
    } else {
      showError(res.error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ghost-white">Omnichannel</h1>
      <p className="mt-1 text-on-surface-variant">Enable SMS, WhatsApp, and web chat for your agents.</p>

      {loading ? (
        <div className="mt-8 grid animate-pulse gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : (
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {CHANNEL_META.map((ch) => (
          <div key={ch.id} className="surface-card p-6">
            <h3 className="font-semibold">{ch.name}</h3>
            <p className="mt-2 text-sm text-on-surface-variant">{ch.desc}</p>
            <button
              type="button"
              onClick={() => toggleChannel(ch.id)}
              disabled={saving === ch.id || ch.id === "web_chat"}
              className={`mt-4 btn-secondary text-xs ${enabled[ch.id] ? "border-teal-500 text-teal-700" : ""} ${ch.id === "web_chat" ? "opacity-50" : ""}`}
            >
              {ch.id === "web_chat"
                ? "Coming soon"
                : saving === ch.id
                  ? "Saving…"
                  : enabled[ch.id]
                    ? "Enabled"
                    : "Enable channel"}
            </button>
          </div>
        ))}
      </div>
      )}

      <div className="mt-8 surface-card p-6 text-sm text-on-surface-variant">
        <p className="font-medium text-ghost-white">Webhook setup</p>
        <p className="mt-2">Point Twilio Messaging inbound webhook to:</p>
        <code className="mt-2 block rounded-lg bg-surface-container p-3 text-xs break-all">{webhookUrl}</code>
      </div>
    </div>
  );
}
