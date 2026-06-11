"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import Link from "next/link";
import type { Agent } from "@/lib/types";
import { fetchTrialStatus } from "@/lib/trial-client";
import { TRIAL_MARKETING } from "@/lib/trial";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Array<{ id: string; name: string; status: string; contact_list: unknown[] }>>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [name, setName] = useState("");
  const [phones, setPhones] = useState("");
  const [agentId, setAgentId] = useState("");
  const [error, setError] = useState("");
  const [starting, setStarting] = useState<string | null>(null);
  const [onTrial, setOnTrial] = useState(false);

  const refreshCampaigns = useCallback(() => {
    return Promise.all([
      apiFetch<{ campaigns: typeof campaigns }>("/api/campaigns"),
      apiFetch<{ agents: Agent[] }>("/api/agents"),
    ]).then(([cRes, aRes]) => {
      if (cRes.ok) setCampaigns(cRes.data.campaigns || []);
      else setError(cRes.error);
      if (aRes.ok) {
        setAgents(aRes.data.agents || []);
        if (aRes.data.agents?.[0]) {
          setAgentId((prev) => prev || aRes.data.agents![0].id);
        }
      }
    });
  }, []);

  useEffect(() => {
    let active = true;
    fetchTrialStatus().then((status) => {
      if (active && status) setOnTrial(status.onTrial && !status.subscribed);
    });
    refreshCampaigns().then(() => {
      if (!active) return;
    });
    return () => {
      active = false;
    };
  }, [refreshCampaigns]);

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const contact_list = phones.split("\n").filter(Boolean).map((phone) => ({ phone: phone.trim() }));
    const res = await apiFetch<{ campaign: (typeof campaigns)[0] }>("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contact_list, agent_id: agentId || undefined }),
    });
    if (res.ok) {
      setCampaigns((prev) => [res.data.campaign, ...prev]);
      setName("");
      setPhones("");
    } else {
      setError(res.error);
    }
  }

  async function startCampaign(id: string) {
    setStarting(id);
    setError("");
    const res = await apiFetch<{ ok: boolean; dialed?: number }>("/api/campaigns", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "start" }),
    });
    setStarting(null);
    if (res.ok) {
      await refreshCampaigns();
    } else {
      setError(res.error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ghost-white">Outbound Campaigns</h1>
      <p className="mt-1 text-on-surface-variant">TCPA-compliant outbound calling. Requires prior express written consent per contact.</p>
      {onTrial && (
        <p className="mt-3 text-sm text-amber-200">
          Outbound campaigns use trial or plan minutes.{" "}
          <Link href="/dashboard/billing" className="text-primary-glow hover:underline">
            {TRIAL_MARKETING.goLiveCta}
          </Link>
        </p>
      )}
      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      <form onSubmit={createCampaign} className="mt-8 surface-card space-y-4 p-6">
        <input className="input-field" placeholder="Campaign name" value={name} onChange={(e) => setName(e.target.value)} required />
        {agents.length > 0 && (
          <select className="input-field" value={agentId} onChange={(e) => setAgentId(e.target.value)}>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        )}
        <textarea className="input-field min-h-32 font-mono text-xs" placeholder="Phone numbers (one per line, E.164 format)" value={phones} onChange={(e) => setPhones(e.target.value)} />
        <button type="submit" className="btn-primary">Create campaign</button>
      </form>

      <div className="mt-8 space-y-3">
        {campaigns.length === 0 ? (
          <p className="text-slate-text">No campaigns yet.</p>
        ) : (
          campaigns.map((c) => (
            <div key={c.id} className="surface-card flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-on-surface-variant">
                  {Array.isArray(c.contact_list) ? c.contact_list.length : 0} contacts · {c.status}
                </p>
              </div>
              {c.status === "draft" && (
                <button
                  type="button"
                  onClick={() => startCampaign(c.id)}
                  disabled={starting === c.id}
                  className="btn-secondary text-xs"
                >
                  {starting === c.id ? "Starting…" : "Start (TCPA check)"}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
