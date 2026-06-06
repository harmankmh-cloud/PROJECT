"use client";

import { useEffect, useState } from "react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Array<{ id: string; name: string; status: string; contact_list: unknown[] }>>([]);
  const [name, setName] = useState("");
  const [phones, setPhones] = useState("");

  useEffect(() => {
    fetch("/api/campaigns").then((r) => r.json()).then((d) => setCampaigns(d.campaigns || []));
  }, []);

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    const contact_list = phones.split("\n").filter(Boolean).map((phone) => ({ phone: phone.trim() }));
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contact_list }),
    });
    const data = await res.json();
    if (data.campaign) {
      setCampaigns((prev) => [data.campaign, ...prev]);
      setName("");
      setPhones("");
    }
  }

  async function startCampaign(id: string) {
    await fetch("/api/campaigns", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "start" }),
    });
    fetch("/api/campaigns").then((r) => r.json()).then((d) => setCampaigns(d.campaigns || []));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Outbound Campaigns</h1>
      <p className="mt-1 text-slate-500">TCPA-compliant outbound calling. Requires prior express written consent per contact.</p>

      <form onSubmit={createCampaign} className="mt-8 surface-card space-y-4 p-6">
        <input className="input-field" placeholder="Campaign name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea className="input-field min-h-32 font-mono text-xs" placeholder="Phone numbers (one per line, E.164 format)" value={phones} onChange={(e) => setPhones(e.target.value)} />
        <button type="submit" className="btn-primary">Create campaign</button>
      </form>

      <div className="mt-8 space-y-3">
        {campaigns.map((c) => (
          <div key={c.id} className="surface-card flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-slate-500">{Array.isArray(c.contact_list) ? c.contact_list.length : 0} contacts · {c.status}</p>
            </div>
            {c.status === "draft" && (
              <button type="button" onClick={() => startCampaign(c.id)} className="btn-secondary text-xs">Start (TCPA check)</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
