"use client";

import { useEffect, useState } from "react";
import { FlowBuilder } from "@/components/FlowBuilder";
import { DEFAULT_FLOW_EDGES, DEFAULT_FLOW_NODES } from "@/lib/flow-engine";
import { apiFetch } from "@/lib/api-client";

type Flow = {
  id: string;
  name: string;
  is_published: boolean;
  nodes?: typeof DEFAULT_FLOW_NODES;
  edges?: typeof DEFAULT_FLOW_EDGES;
};

export default function FlowsPage() {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [flowName, setFlowName] = useState("Main Flow");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch<{ flows: Flow[] }>("/api/flows").then((res) => {
      if (res.ok) setFlows(res.data.flows || []);
      else setError(res.error);
    });
  }, []);

  async function saveFlow(nodes: typeof DEFAULT_FLOW_NODES, edges: typeof DEFAULT_FLOW_EDGES) {
    setSaving(true);
    setError("");
    const res = await apiFetch<{ flow: Flow }>("/api/flows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: flowName, nodes, edges, is_published: true }),
    });
    setSaving(false);
    if (res.ok) {
      setFlows((prev) => [res.data.flow, ...prev.filter((f) => f.id !== res.data.flow.id)]);
    } else {
      setError(res.error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Flow Builder</h1>
      <p className="mt-1 text-slate-500">Design conversation flows with greet, ask, branch, tool, transfer, and end nodes.</p>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex items-center gap-3">
        <input
          className="input-field max-w-xs"
          placeholder="Flow name"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
        />
        {saving && <span className="text-sm text-slate-400">Saving…</span>}
      </div>

      <div className="mt-4">
        <FlowBuilder onSave={saveFlow} />
      </div>

      {flows.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold">Saved flows</h2>
          <ul className="mt-3 space-y-2">
            {flows.map((f) => (
              <li key={f.id} className="surface-card flex items-center justify-between px-4 py-3 text-sm">
                <span>{f.name}</span>
                <span className={f.is_published ? "text-teal-600" : "text-slate-400"}>
                  {f.is_published ? "Published" : "Draft"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
