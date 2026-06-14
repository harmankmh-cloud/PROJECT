"use client";

import { useEffect, useState } from "react";
import { FlowBuilder } from "@/components/FlowBuilder";
import { DEFAULT_FLOW_EDGES, DEFAULT_FLOW_NODES } from "@/lib/flow-engine";
import type { Agent, FlowEdge, FlowNode } from "@/lib/types";
import { apiFetch } from "@/lib/api-client";

type Flow = {
  id: string;
  name: string;
  agent_id: string | null;
  is_published: boolean;
  nodes?: FlowNode[];
  edges?: FlowEdge[];
};

export default function FlowsPage() {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [flowName, setFlowName] = useState("Main Flow");
  const [agentId, setAgentId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [builderNodes, setBuilderNodes] = useState<FlowNode[]>(DEFAULT_FLOW_NODES);
  const [builderEdges, setBuilderEdges] = useState<FlowEdge[]>(DEFAULT_FLOW_EDGES);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      apiFetch<{ flows: Flow[] }>("/api/flows"),
      apiFetch<{ agents: Agent[] }>("/api/agents"),
    ]).then(([flowsRes, agentsRes]) => {
      if (flowsRes.ok) setFlows(flowsRes.data.flows || []);
      else setError(flowsRes.error);
      if (agentsRes.ok) setAgents(agentsRes.data.agents || []);
    });
  }, []);

  function loadFlow(flow: Flow) {
    setEditingId(flow.id);
    setFlowName(flow.name);
    setAgentId(flow.agent_id || "");
    setBuilderNodes(flow.nodes || DEFAULT_FLOW_NODES);
    setBuilderEdges(flow.edges || DEFAULT_FLOW_EDGES);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startNewFlow() {
    setEditingId(null);
    setFlowName("Main Flow");
    setAgentId("");
    setBuilderNodes(DEFAULT_FLOW_NODES);
    setBuilderEdges(DEFAULT_FLOW_EDGES);
    setError("");
  }

  async function saveFlow(nodes: FlowNode[], edges: FlowEdge[]) {
    if (!agentId) {
      setError("Select an agent — flows run on live calls for that agent.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      name: flowName,
      agent_id: agentId,
      nodes,
      edges,
      is_published: true,
    };

    const res = editingId
      ? await apiFetch<{ flow: Flow }>("/api/flows", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        })
      : await apiFetch<{ flow: Flow }>("/api/flows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    setSaving(false);
    if (res.ok) {
      setFlows((prev) => {
        const next = prev.filter((f) => f.id !== res.data.flow.id);
        return [res.data.flow, ...next];
      });
      setEditingId(res.data.flow.id);
    } else {
      setError(res.error);
    }
  }

  async function deleteFlow(id: string) {
    if (!confirm("Delete this flow?")) return;
    const res = await apiFetch("/api/flows", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setFlows((prev) => prev.filter((f) => f.id !== id));
      if (editingId === id) startNewFlow();
    } else {
      setError(res.error);
    }
  }

  function agentLabel(id: string | null) {
    if (!id) return "No agent";
    return agents.find((a) => a.id === id)?.name || "Unknown agent";
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ghost-white">Flow Builder</h1>
          <p className="mt-1 text-on-surface-variant">
            Published flows drive live call logic for the selected agent.
          </p>
        </div>
        {editingId && (
          <button type="button" onClick={startNewFlow} className="btn-secondary text-sm">
            + New flow
          </button>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          className="input-field max-w-xs"
          placeholder="Flow name"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
        />
        <select className="input-field max-w-xs" value={agentId} onChange={(e) => setAgentId(e.target.value)}>
          <option value="">Select agent</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        {editingId && <span className="text-sm text-teal-600">Editing existing flow</span>}
        {saving && <span className="text-sm text-slate-text">Saving…</span>}
      </div>

      <div className="mt-4">
        <FlowBuilder
          key={editingId || "new"}
          initialNodes={builderNodes}
          initialEdges={builderEdges}
          onSave={saveFlow}
        />
      </div>

      {flows.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold">Saved flows</h2>
          <ul className="mt-3 space-y-2">
            {flows.map((f) => (
              <li key={f.id} className="surface-card flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                <div>
                  <span className="font-medium">{f.name}</span>
                  <span className="ml-2 text-slate-text">→ {agentLabel(f.agent_id)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={f.is_published ? "text-teal-600" : "text-slate-text"}>
                    {f.is_published ? "Published" : "Draft"}
                  </span>
                  <button type="button" onClick={() => loadFlow(f)} className="text-teal-700 hover:underline">
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteFlow(f.id)} className="text-error hover:underline">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
