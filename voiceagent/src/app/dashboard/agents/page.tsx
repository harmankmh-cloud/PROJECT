"use client";

import { useEffect, useState } from "react";
import type { Agent } from "@/lib/types";
import { apiFetch } from "@/lib/api-client";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [form, setForm] = useState({ name: "", system_prompt: "", welcome_greeting: "", escalation_phone: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiFetch<{ agents: Agent[] }>("/api/agents").then((res) => {
      if (!active) return;
      if (res.ok) setAgents(res.data.agents || []);
      else setError(res.error);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  async function createAgent(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await apiFetch<{ agent: Agent }>("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setAgents((prev) => [res.data.agent, ...prev]);
      setForm({ name: "", system_prompt: "", welcome_greeting: "", escalation_phone: "" });
    } else {
      setError(res.error);
    }
  }

  async function updateAgent(agent: Agent) {
    setError("");
    const res = await apiFetch<{ agent: Agent }>("/api/agents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agent),
    });
    if (res.ok) {
      setAgents((prev) => prev.map((a) => (a.id === agent.id ? res.data.agent : a)));
      setEditingId(null);
    } else {
      setError(res.error);
    }
  }

  async function toggleActive(agent: Agent) {
    await updateAgent({ ...agent, is_active: !agent.is_active });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Voice Agents</h1>
      <p className="mt-1 text-slate-500">Configure AI agents that answer your phone line.</p>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <form onSubmit={createAgent} className="mt-8 surface-card space-y-4 p-6">
        <h2 className="font-semibold">Create agent</h2>
        <input className="input-field" placeholder="Agent name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <textarea className="input-field min-h-24" placeholder="System prompt" value={form.system_prompt} onChange={(e) => setForm({ ...form, system_prompt: e.target.value })} />
        <input className="input-field" placeholder="Welcome greeting" value={form.welcome_greeting} onChange={(e) => setForm({ ...form, welcome_greeting: e.target.value })} />
        <input className="input-field" placeholder="Escalation phone (+1...)" value={form.escalation_phone} onChange={(e) => setForm({ ...form, escalation_phone: e.target.value })} />
        <button type="submit" className="btn-primary">Create agent</button>
      </form>

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : agents.length === 0 ? (
          <p className="text-slate-400">No agents yet.</p>
        ) : (
          agents.map((agent) => (
            <div key={agent.id} className="surface-card p-5">
              {editingId === agent.id ? (
                <AgentEditForm
                  agent={agent}
                  onSave={updateAgent}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold">{agent.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${agent.is_active ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500"}`}>
                        {agent.is_active ? "Active" : "Inactive"}
                      </span>
                      <button type="button" onClick={() => toggleActive(agent)} className="btn-secondary text-xs">
                        {agent.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button type="button" onClick={() => setEditingId(agent.id)} className="btn-secondary text-xs">
                        Edit
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{agent.system_prompt}</p>
                  <p className="mt-2 text-xs text-slate-400">Greeting: {agent.welcome_greeting}</p>
                  {agent.escalation_phone && (
                    <p className="mt-1 text-xs text-slate-400">Transfer: {agent.escalation_phone}</p>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AgentEditForm({
  agent,
  onSave,
  onCancel,
}: {
  agent: Agent;
  onSave: (a: Agent) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(agent);

  return (
    <div className="space-y-3">
      <input className="input-field" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
      <textarea className="input-field min-h-24" value={draft.system_prompt} onChange={(e) => setDraft({ ...draft, system_prompt: e.target.value })} />
      <input className="input-field" value={draft.welcome_greeting} onChange={(e) => setDraft({ ...draft, welcome_greeting: e.target.value })} />
      <input className="input-field" placeholder="Escalation phone" value={draft.escalation_phone || ""} onChange={(e) => setDraft({ ...draft, escalation_phone: e.target.value })} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={draft.knowledge_base_enabled} onChange={(e) => setDraft({ ...draft, knowledge_base_enabled: e.target.checked })} />
        Knowledge base enabled
      </label>
      <div className="flex gap-2">
        <button type="button" onClick={() => onSave(draft)} className="btn-primary text-sm">Save</button>
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
      </div>
    </div>
  );
}
