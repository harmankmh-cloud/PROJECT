"use client";

import { useEffect, useState } from "react";

export default function IntegrationsPage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    if (connected) setMessage(`Connected ${connected}`);
  }, []);

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
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Integrations</h1>
      <p className="mt-1 text-slate-500">Connect CRM and calendar for live call actions.</p>
      {message && <p className="mt-4 rounded-lg bg-teal-50 px-4 py-2 text-sm text-teal-700">{message}</p>}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="surface-card p-6">
          <h3 className="font-semibold">HubSpot</h3>
          <p className="mt-2 text-sm text-slate-600">Create contacts and log call notes during and after calls.</p>
          <button type="button" onClick={connectHubSpot} className="btn-primary mt-4">Connect HubSpot</button>
        </div>
        <div className="surface-card p-6">
          <h3 className="font-semibold">Google Calendar</h3>
          <p className="mt-2 text-sm text-slate-600">Book appointments when callers request scheduling.</p>
          <button type="button" onClick={connectGoogle} className="btn-primary mt-4">Connect Google Calendar</button>
        </div>
      </div>
    </div>
  );
}
