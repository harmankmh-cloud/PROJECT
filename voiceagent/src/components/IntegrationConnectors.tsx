"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type Integration = {
  provider: string;
  is_active: boolean;
  token_expires_at: string | null;
};

export function IntegrationConnectors({ initialMessage = "" }: { initialMessage?: string }) {
  const [message, setMessage] = useState(initialMessage);
  const [connected, setConnected] = useState<Integration[]>([]);

  useEffect(() => {
    apiFetch<{ integrations: Integration[] }>("/api/integrations/status").then((res) => {
      if (res.ok) setConnected(res.data.integrations || []);
    });
  }, []);

  async function connectHubSpot() {
    const res = await apiFetch<{ authUrl?: string }>("/api/integrations/hubspot");
    if (res.ok && res.data.authUrl) window.location.href = res.data.authUrl;
    else setMessage(res.ok ? "HubSpot not configured" : res.error);
  }

  async function connectGoogle() {
    const res = await apiFetch<{ authUrl?: string }>("/api/integrations/google-calendar");
    if (res.ok && res.data.authUrl) window.location.href = res.data.authUrl;
    else setMessage(res.ok ? "Google Calendar not configured" : res.error);
  }

  function isConnected(provider: string) {
    return connected.some((i) => i.provider === provider && i.is_active);
  }

  return (
    <>
      {message && <p className="mt-4 text-sm text-teal-700">{message}</p>}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="font-semibold">HubSpot</h2>
          <p className="mt-2 text-sm text-slate-600">Log calls and sync contacts after each conversation.</p>
          {isConnected("hubspot") && (
            <p className="mt-2 text-xs text-teal-600">Connected</p>
          )}
          <button type="button" onClick={connectHubSpot} className="btn-primary mt-4 text-sm">
            {isConnected("hubspot") ? "Reconnect HubSpot" : "Connect HubSpot"}
          </button>
        </div>
        <div className="surface-card p-6">
          <h2 className="font-semibold">Google Calendar</h2>
          <p className="mt-2 text-sm text-slate-600">Book appointments during live calls.</p>
          {isConnected("google_calendar") && (
            <p className="mt-2 text-xs text-teal-600">Connected</p>
          )}
          <button type="button" onClick={connectGoogle} className="btn-primary mt-4 text-sm">
            {isConnected("google_calendar") ? "Reconnect Google Calendar" : "Connect Google Calendar"}
          </button>
        </div>
      </div>
    </>
  );
}
