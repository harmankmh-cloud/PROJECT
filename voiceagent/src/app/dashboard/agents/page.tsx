"use client";

import { useEffect, useState } from "react";
import type { Agent } from "@/lib/types";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [form, setForm] = useState({ name: "", system_prompt: "", welcome_greeting: "", escalation_phone: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents").then((r) => r.json()).then((d) => {
      setAgents(d.agents || []);
      setLoading(false);
    });
  }, []);

  async function createAgent(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.agent) {
      setAgents((prev) => [data.agent, ...prev]);
      setForm({ name: "", system_prompt: "", welcome_greeting: "", escalation_phone: "" });
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Voice Agents</h1>
      <p className="mt-1 text-slate-500">Configure AI agents that answer your phone line.</p>

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
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{agent.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs ${agent.is_active ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500"}`}>
                  {agent.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600 line-clamp-2">{agent.system_prompt}</p>
              <p className="mt-2 text-xs text-slate-400">Greeting: {agent.welcome_greeting}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
