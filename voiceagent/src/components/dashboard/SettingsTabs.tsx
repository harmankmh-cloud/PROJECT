"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BusinessHoursEditor } from "@/components/BusinessHoursEditor";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/providers/ToastProvider";
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

const TAB_LIST = [
  { value: "profile", label: "Profile" },
  { value: "call-handling", label: "Call handling" },
  { value: "greetings", label: "Greetings" },
  { value: "integrations", label: "Integrations" },
  { value: "team", label: "Team" },
  { value: "billing", label: "Billing" },
  { value: "notifications", label: "Notifications" },
  { value: "danger", label: "Danger zone" },
] as const;

export function SettingsTabs() {
  const { showError, showSuccess } = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);

  useEffect(() => {
    Promise.all([
      apiFetch<{ settings: Settings }>("/api/settings"),
      apiFetch<{ agents: Array<{ system_prompt: string; welcome_greeting: string }> }>("/api/agents"),
    ]).then(([settingsRes, agentsRes]) => {
      if (settingsRes.ok) setSettings(settingsRes.data.settings);
      else showError(settingsRes.error);
      if (agentsRes.ok && agentsRes.data.agents[0]) {
        setGreeting(agentsRes.data.agents[0].welcome_greeting || agentsRes.data.agents[0].system_prompt);
      }
      setLoading(false);
    });
  }, []);

  async function saveSettings(patch: Partial<Settings>) {
    if (!settings) return;
    setSaving(true);
    const merged = { ...settings, ...patch };
    const res = await apiFetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(merged),
    });
    setSaving(false);
    if (res.ok) {
      setSettings(merged);
      showSuccess("Settings saved.");
    } else showError(res.error);
  }

  if (loading) {
    return (
      <div className="dashboard-container space-y-4 py-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!settings) {
    return <p className="p-8 text-danger">Could not load settings.</p>;
  }

  return (
    <div className="dashboard-container py-8">
      <h1 className="font-display text-2xl text-text">Settings</h1>
      <p className="mt-1 text-sm text-muted">Manage your GreetQ configuration</p>

      <Tabs.Root defaultValue="profile" className="mt-8">
        <Tabs.List className="flex flex-wrap gap-1 border-b border-border pb-px">
          {TAB_LIST.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className={`rounded-t-lg px-4 py-2.5 text-sm font-medium transition data-[state=active]:border-b-2 data-[state=active]:text-text ${
                tab.value === "danger"
                  ? "text-danger data-[state=active]:border-danger"
                  : "text-muted data-[state=active]:border-[var(--color-primary)]"
              }`}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="profile" className="mt-6 space-y-4">
          <CardSection title="Organization">
            <input
              className="input-field"
              placeholder="Organization name"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            />
            <input
              className="input-field"
              placeholder="Timezone (e.g. America/Vancouver)"
              value={settings.data_region}
              onChange={(e) => setSettings({ ...settings, data_region: e.target.value })}
            />
            <BusinessHoursEditor
              value={settings.business_hours || DEFAULT_BUSINESS_HOURS}
              onChange={(h) => setSettings({ ...settings, business_hours: h })}
            />
            <Button loading={saving} onClick={() => saveSettings(settings)}>Save</Button>
          </CardSection>
        </Tabs.Content>

        <Tabs.Content value="greetings" className="mt-6">
          <CardSection title="Custom greeting script">
            <textarea
              className="input-field min-h-[120px] font-mono text-sm"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-muted">{greeting.length}/500 characters</p>
            <Link href="/dashboard/agents" className="text-sm text-primary-glow hover:underline">
              Edit full agent in Agent Studio →
            </Link>
          </CardSection>
        </Tabs.Content>

        <Tabs.Content value="call-handling" className="mt-6 space-y-4">
          <CardSection title="Call routing">
            <label className="flex items-center justify-between rounded-lg border border-border p-4">
              <span className="text-sm text-text">Forward to mobile</span>
              <input
                type="checkbox"
                checked={Boolean(settings.transfer_phone)}
                onChange={() => {}}
                className="accent-primary"
              />
            </label>
            <input
              className="input-field"
              placeholder="Transfer phone (+1...)"
              value={settings.transfer_phone}
              onChange={(e) => setSettings({ ...settings, transfer_phone: e.target.value })}
            />
            <label className="flex items-center justify-between rounded-lg border border-border p-4">
              <span className="text-sm text-text">Send SMS summary after calls</span>
              <input type="checkbox" defaultChecked className="accent-primary" />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-border p-4">
              <span className="text-sm text-text">Book via Google Calendar</span>
              <input type="checkbox" className="accent-primary" />
            </label>
            <Button loading={saving} onClick={() => saveSettings(settings)}>Save routing</Button>
          </CardSection>
        </Tabs.Content>

        <Tabs.Content value="notifications" className="mt-6">
          <CardSection title="Notifications">
            <label className="flex items-center gap-3 text-sm text-text">
              <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} className="accent-primary" />
              Email notifications for new calls
            </label>
            <label className="flex items-center gap-3 text-sm text-text">
              <input type="checkbox" checked={notifySms} onChange={(e) => setNotifySms(e.target.checked)} className="accent-primary" />
              SMS summaries to your phone
            </label>
            <Button onClick={() => showSuccess("Notification preferences saved.")}>Save</Button>
          </CardSection>
        </Tabs.Content>

        <Tabs.Content value="team" className="mt-6">
          <CardSection title="Team">
            <p className="text-sm text-muted">Invite team members to manage your GreetQ account.</p>
            <Link href="/dashboard/team" className="btn-primary inline-flex mt-4">
              Manage team →
            </Link>
          </CardSection>
        </Tabs.Content>

        <Tabs.Content value="integrations" className="mt-6">
          <CardSection title="Integrations">
            <p className="text-sm text-muted">
              Connect Google Calendar and HubSpot today. Calendly is on the roadmap — use webhooks for other tools.
            </p>
            <Link href="/dashboard/integrations" className="btn-primary inline-flex mt-4">
              Manage integrations →
            </Link>
          </CardSection>
        </Tabs.Content>

        <Tabs.Content value="billing" className="mt-6">
          <CardSection title="Billing">
            <p className="text-sm text-muted">View usage, invoices, and upgrade your plan.</p>
            <Link href="/dashboard/billing" className="btn-primary inline-flex mt-4">
              Open billing →
            </Link>
          </CardSection>
        </Tabs.Content>

        <Tabs.Content value="danger" className="mt-6">
          <CardSection title="Danger zone">
            <p className="text-sm text-muted">
              Permanently delete your organization and all call data. This cannot be undone.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-danger/50 text-danger hover:bg-danger/10"
              onClick={() => showError("Contact support to delete your account — hello@greetq.com")}
            >
              Request account deletion
            </Button>
          </CardSection>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

function CardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-glow space-y-4 rounded-xl p-6">
      <h2 className="font-semibold text-text">{title}</h2>
      {children}
    </div>
  );
}
