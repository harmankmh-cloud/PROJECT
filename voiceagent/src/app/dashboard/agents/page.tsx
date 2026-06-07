"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import type { Agent } from "@/lib/types";
import { apiFetch } from "@/lib/api-client";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  async function toggleActive(agent: Agent) {
    const res = await apiFetch<{ agent: Agent }>("/api/agents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: agent.id, is_active: !agent.is_active }),
    });
    if (res.ok) {
      setAgents((prev) => prev.map((a) => (a.id === agent.id ? res.data.agent : a)));
    } else {
      setError(res.error);
    }
  }

  return (
    <div className="dashboard-container pb-8">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-on-surface">Voice Agents</h1>
          <p className="mt-2 text-on-primary-container">Configure AI agents that answer your phone line.</p>
        </div>
        <Link
          href="/dashboard/agents/new"
          className="btn-primary flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <MaterialIcon name="add" />
          New agent
        </Link>
      </header>

      {error && <p className="mb-4 text-sm text-error">{error}</p>}

      {loading ? (
        <p className="text-on-primary-container">Loading agents…</p>
      ) : agents.length === 0 ? (
        <div className="glass-panel rounded-xl p-10 text-center">
          <MaterialIcon name="smart_toy" className="mb-4 text-5xl text-on-primary-container" />
          <h2 className="text-xl font-bold text-on-surface">No agents yet</h2>
          <p className="mt-2 text-sm text-on-primary-container">
            Create your first receptionist agent to start answering calls.
          </p>
          <Link
            href="/dashboard/agents/new"
            className="btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm"
          >
            <MaterialIcon name="add" />
            Configure Agent
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="glass-panel flex flex-col gap-4 rounded-xl p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container">
                  <MaterialIcon name="support_agent" className="text-on-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-on-surface">{agent.name}</h3>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-text">{agent.system_prompt || "No prompt set"}</p>
                  <p className="mt-1 text-xs text-on-primary-container">
                    {agent.voice} · {agent.language}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    agent.is_active
                      ? "bg-on-tertiary-container/10 text-on-tertiary-container"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {agent.is_active ? "Active" : "Inactive"}
                </span>
                <button
                  type="button"
                  onClick={() => toggleActive(agent)}
                  className="rounded-lg border border-outline-variant/30 px-3 py-1.5 text-xs font-semibold text-slate-text hover:bg-surface-container-low"
                >
                  {agent.is_active ? "Deactivate" : "Activate"}
                </button>
                <Link
                  href={`/dashboard/agents/${agent.id}`}
                  className="rounded-lg bg-secondary px-4 py-1.5 text-xs font-semibold text-on-secondary"
                >
                  Configure
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
