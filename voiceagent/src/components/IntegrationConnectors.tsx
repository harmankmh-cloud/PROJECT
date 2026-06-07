"use client";

import { useState } from "react";

export function IntegrationConnectors({ initialMessage = "" }: { initialMessage?: string }) {
  const [message, setMessage] = useState(initialMessage);

  async function connectHubSpot() {
    const res = await fetch("/api/integrations/hubspot");
    const data = await res.json();
    if (data.authUrl) window.location.href = data.authUrl;
    else setMessage(data.error || "HubSpot not configured");
  }

  async function connectGoogle() {
    const res = await fetch("/api/integrations/google-calendar");
    const data = await res.json();
    if (data.authUrl) window.location.href = data.authUrl;
    else setMessage(data.error || "Google Calendar not configured");
  }

  return (
    <>
      {message && <p className="mt-4 text-sm text-teal-700">{message}</p>}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="font-semibold">HubSpot</h2>
          <p className="mt-2 text-sm text-slate-600">Log calls and sync contacts after each conversation.</p>
          <button type="button" onClick={connectHubSpot} className="btn-primary mt-4 text-sm">Connect HubSpot</button>
        </div>
        <div className="surface-card p-6">
          <h2 className="font-semibold">Google Calendar</h2>
          <p className="mt-2 text-sm text-slate-600">Book appointments during live calls.</p>
          <button type="button" onClick={connectGoogle} className="btn-primary mt-4 text-sm">Connect Google Calendar</button>
        </div>
      </div>
    </>
  );
}
