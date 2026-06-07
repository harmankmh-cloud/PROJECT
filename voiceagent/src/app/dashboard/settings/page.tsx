"use client";

import { useEffect, useState } from "react";
import { BusinessHoursEditor } from "@/components/BusinessHoursEditor";
import { DEFAULT_BUSINESS_HOURS, type BusinessHours } from "@/lib/business-hours";
import { apiFetch } from "@/lib/api-client";

type Settings = {
  name: string;
  transfer_phone: string;
  data_region: string;
  white_label: { brandName?: string; domain?: string };
  hipaa_enabled: boolean;
  recording_retention_days: number;
  business_hours: BusinessHours;
  webhook_url: string;
  webhook_secret: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ settings: Settings }>("/api/settings").then((res) => {
      if (res.ok) setSettings(res.data.settings);
      else setError(res.error);
      setLoading(false);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError("");
    setMessage("");

    const res = await apiFetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setSaving(false);
    if (res.ok) {
      setMessage("Settings saved.");
    } else {
      setError(res.error);
    }
  }

  if (loading) return <p className="text-slate-text">Loading settings…</p>;
  if (!settings) return <p className="text-error">{error || "Could not load settings."}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ghost-white">Settings</h1>
      <p className="mt-1 text-on-surface-variant">Organization defaults and compliance options.</p>

      {message && <p className="mt-4 text-sm text-teal-700">{message}</p>}
      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <div className="surface-card p-6 space-y-4">
          <h2 className="font-semibold">Organization</h2>
          <input
            className="input-field"
            placeholder="Organization name"
            value={settings.name}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="Default transfer phone (+1...)"
            value={settings.transfer_phone}
            onChange={(e) => setSettings({ ...settings, transfer_phone: e.target.value })}
          />
        </div>

        <div className="surface-card p-6 space-y-4">
          <h2 className="font-semibold">Business hours</h2>
          <p className="text-sm text-on-surface-variant">
            Inbound calls outside these hours hear an after-hours message instead of your agent.
          </p>
          <BusinessHoursEditor
            value={
              Object.keys(settings.business_hours || {}).length
                ? settings.business_hours
                : DEFAULT_BUSINESS_HOURS
            }
            onChange={(business_hours) => setSettings({ ...settings, business_hours })}
          />
        </div>

        <div className="surface-card p-6 space-y-4">
          <h2 className="font-semibold">Outbound webhooks</h2>
          <input
            className="input-field"
            placeholder="https://your-app.com/webhooks/greetq"
            value={settings.webhook_url}
            onChange={(e) => setSettings({ ...settings, webhook_url: e.target.value })}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Webhook signing secret (optional)"
            value={settings.webhook_secret}
            onChange={(e) => setSettings({ ...settings, webhook_secret: e.target.value })}
          />
        </div>

        <div className="surface-card p-6 space-y-4">
          <h2 className="font-semibold">Data Residency</h2>
          <select
            className="input-field"
            value={settings.data_region}
            onChange={(e) => setSettings({ ...settings, data_region: e.target.value })}
          >
            <option value="us">United States</option>
            <option value="eu">European Union</option>
          </select>
        </div>

        <div className="surface-card p-6 space-y-4">
          <h2 className="font-semibold">White-label (Enterprise)</h2>
          <input
            className="input-field"
            placeholder="Brand name"
            value={settings.white_label?.brandName || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                white_label: { ...settings.white_label, brandName: e.target.value },
              })
            }
          />
          <input
            className="input-field"
            placeholder="Custom domain"
            value={settings.white_label?.domain || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                white_label: { ...settings.white_label, domain: e.target.value },
              })
            }
          />
        </div>

        <div className="surface-card p-6 space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.hipaa_enabled}
              onChange={(e) => setSettings({ ...settings, hipaa_enabled: e.target.checked })}
            />
            <span className="text-sm">Enable HIPAA mode (BAA required)</span>
          </label>
          <input
            type="number"
            className="input-field"
            min={1}
            placeholder="Recording retention (days)"
            value={settings.recording_retention_days}
            onChange={(e) =>
              setSettings({ ...settings, recording_retention_days: Number(e.target.value) })
            }
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
