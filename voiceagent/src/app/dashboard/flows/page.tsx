"use client";

import { useEffect, useState } from "react";
import { FlowBuilder } from "@/components/FlowBuilder";
import { DEFAULT_FLOW_EDGES, DEFAULT_FLOW_NODES } from "@/lib/flow-engine";

export default function FlowsPage() {
  const [flows, setFlows] = useState<Array<{ id: string; name: string; is_published: boolean }>>([]);

  useEffect(() => {
    fetch("/api/flows").then((r) => r.json()).then((d) => setFlows(d.flows || []));
  }, []);

  async function saveFlow(nodes: typeof DEFAULT_FLOW_NODES, edges: typeof DEFAULT_FLOW_EDGES) {
    const res = await fetch("/api/flows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Main Flow", nodes, edges, is_published: true }),
    });
    const data = await res.json();
    if (data.flow) setFlows((prev) => [data.flow, ...prev]);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Flow Builder</h1>
      <p className="mt-1 text-slate-500">Design conversation flows with greet, ask, branch, tool, transfer, and end nodes.</p>

      <div className="mt-8">
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
