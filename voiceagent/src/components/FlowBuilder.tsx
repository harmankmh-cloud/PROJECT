"use client";

import { useState } from "react";
import type { FlowEdge, FlowNode } from "@/lib/types";
import { DEFAULT_FLOW_EDGES, DEFAULT_FLOW_NODES } from "@/lib/flow-engine";

const NODE_TYPES = ["greet", "ask", "branch", "tool", "transfer", "end"] as const;

export function FlowBuilder({
  initialNodes = DEFAULT_FLOW_NODES,
  initialEdges = DEFAULT_FLOW_EDGES,
  onSave,
}: {
  initialNodes?: FlowNode[];
  initialEdges?: FlowEdge[];
  onSave: (nodes: FlowNode[], edges: FlowEdge[]) => Promise<void>;
}) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges] = useState(initialEdges);
  const [saving, setSaving] = useState(false);

  function addNode(type: (typeof NODE_TYPES)[number]) {
    const id = `${type}_${crypto.randomUUID()}`;
    setNodes((prev) => [
      ...prev,
      { id, type, label: type.charAt(0).toUpperCase() + type.slice(1), config: {} },
    ]);
  }

  async function handleSave() {
    setSaving(true);
    await onSave(nodes, edges);
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {NODE_TYPES.map((t) => (
          <button key={t} type="button" onClick={() => addNode(t)} className="btn-secondary text-xs">
            + {t}
          </button>
        ))}
        <button type="button" onClick={handleSave} disabled={saving} className="btn-primary ml-auto">
          {saving ? "Saving…" : "Save flow"}
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {nodes.map((node) => (
          <div key={node.id} className="surface-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-violet-500">{node.type}</span>
              <span className="text-xs text-slate-400">{node.id}</span>
            </div>
            <p className="mt-2 font-medium">{node.label}</p>
            <pre className="mt-2 overflow-auto rounded-lg bg-slate-50 p-2 text-xs text-slate-600">
              {JSON.stringify(node.config, null, 2) || "{}"}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
