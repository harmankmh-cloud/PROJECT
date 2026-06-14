"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function HomeownerSettingsForm({
  email,
  displayName,
  phone,
}: {
  email: string;
  displayName: string;
  phone: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(displayName);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const res = await fetch("/api/user-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_name: name.trim(),
        phone: phoneValue.trim() || null,
        notification_email: emailAlerts,
        notification_sms: smsAlerts,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Could not save settings");
      return;
    }

    setMessage("Settings saved.");
    router.refresh();
  }

  return (
    <form onSubmit={onSave} className="mt-8 max-w-lg space-y-6 rounded-[14px] border border-border bg-surface p-6">
      <div>
        <p className="font-label text-muted">Email</p>
        <p className="mt-1 text-foreground">{email}</p>
      </div>

      <div>
        <label className="font-label mb-1.5 block text-muted" htmlFor="display_name">
          Display name
        </label>
        <Input id="display_name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <label className="font-label mb-1.5 block text-muted" htmlFor="phone">
          Phone
        </label>
        <Input id="phone" value={phoneValue} onChange={(e) => setPhoneValue(e.target.value)} />
      </div>

      <fieldset className="space-y-3">
        <legend className="font-label text-muted">Notifications</legend>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
          Email alerts for quotes and messages
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} />
          SMS alerts (coming soon)
        </label>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
        <a href="/login?reset=1" className="text-sm font-semibold text-primary hover:underline">
          Change password
        </a>
      </div>

      {message ? <p className="text-sm text-green-600">{message}</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </form>
  );
}
