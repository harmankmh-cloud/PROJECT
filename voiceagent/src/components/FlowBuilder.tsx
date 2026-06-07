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
  const [edges, setEdges] = useState(initialEdges);
  const [saving, setSaving] = useState(false);
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");

  function addNode(type: (typeof NODE_TYPES)[number]) {
    const id = `${type}_${crypto.randomUUID().slice(0, 8)}`;
    setNodes((prev) => [
      ...prev,
      { id, type, label: type.charAt(0).toUpperCase() + type.slice(1), config: {} },
    ]);
  }

  function updateNode(id: string, patch: Partial<FlowNode>) {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }

  function removeNode(id: string) {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
  }

  function addEdge() {
    if (!edgeFrom || !edgeTo || edgeFrom === edgeTo) return;
    const exists = edges.some((e) => e.source === edgeFrom && e.target === edgeTo);
    if (exists) return;
    setEdges((prev) => [
      ...prev,
      { id: `e_${crypto.randomUUID().slice(0, 8)}`, source: edgeFrom, target: edgeTo },
    ]);
    setEdgeFrom("");
    setEdgeTo("");
  }

  function removeEdge(id: string) {
    setEdges((prev) => prev.filter((e) => e.id !== id));
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

      <div className="surface-card p-4">
        <h3 className="text-sm font-semibold text-brand-900">Connections</h3>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <select className="input-field max-w-[10rem]" value={edgeFrom} onChange={(e) => setEdgeFrom(e.target.value)}>
            <option value="">From node</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
          <span className="text-slate-400">→</span>
          <select className="input-field max-w-[10rem]" value={edgeTo} onChange={(e) => setEdgeTo(e.target.value)}>
            <option value="">To node</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
          <button type="button" onClick={addEdge} className="btn-secondary text-xs">
            Add edge
          </button>
        </div>
        {edges.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs text-slate-600">
            {edges.map((e) => (
              <li key={e.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span>
                  {nodes.find((n) => n.id === e.source)?.label || e.source} →{" "}
                  {nodes.find((n) => n.id === e.target)?.label || e.target}
                </span>
                <button type="button" onClick={() => removeEdge(e.id)} className="text-red-600 hover:underline">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {nodes.map((node) => (
          <div key={node.id} className="surface-card p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-violet-500">{node.type}</span>
              <button type="button" onClick={() => removeNode(node.id)} className="text-xs text-red-600 hover:underline">
                Delete
              </button>
            </div>
            <input
              className="input-field mt-2"
              value={node.label}
              onChange={(e) => updateNode(node.id, { label: e.target.value })}
            />
            <textarea
              className="input-field mt-2 min-h-[5rem] font-mono text-xs"
              value={JSON.stringify(node.config ?? {}, null, 2)}
              onChange={(e) => {
                try {
                  const config = JSON.parse(e.target.value || "{}");
                  updateNode(node.id, { config });
                } catch {
                  /* ignore invalid JSON while typing */
                }
              }}
              placeholder='{"prompt": "Ask how you can help"}'
            />
          </div>
        ))}
      </div>
    </div>
  );
}
