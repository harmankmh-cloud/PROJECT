"use client";

import { useEffect, useState } from "react";
import type { Agent } from "@/lib/types";
import { apiFetch } from "@/lib/api-client";

type KnowledgeDoc = {
  id: string;
  title: string;
  content: string;
  source_url: string | null;
  agent_id: string | null;
  va_agents?: { id: string; name: string } | { id: string; name: string }[] | null;
};

export default function KnowledgePage() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [form, setForm] = useState({ title: "", content: "", agent_id: "", source_url: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiFetch<{ docs: KnowledgeDoc[] }>("/api/knowledge"),
      apiFetch<{ agents: Agent[] }>("/api/agents"),
    ]).then(([docsRes, agentsRes]) => {
      if (docsRes.ok) setDocs(docsRes.data.docs || []);
      else setError(docsRes.error);
      if (agentsRes.ok) setAgents(agentsRes.data.agents || []);
      setLoading(false);
    });
  }, []);

  async function saveDoc(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const payload = {
      title: form.title,
      content: form.content,
      agent_id: form.agent_id || null,
      source_url: form.source_url || null,
    };

    const res = editingId
      ? await apiFetch<{ doc: KnowledgeDoc }>("/api/knowledge", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        })
      : await apiFetch<{ doc: KnowledgeDoc }>("/api/knowledge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    if (res.ok) {
      if (editingId) {
        setDocs((prev) => prev.map((d) => (d.id === editingId ? res.data.doc : d)));
        setEditingId(null);
      } else {
        setDocs((prev) => [res.data.doc, ...prev]);
      }
      setForm({ title: "", content: "", agent_id: "", source_url: "" });
    } else {
      setError(res.error);
    }
  }

  function startEdit(doc: KnowledgeDoc) {
    setEditingId(doc.id);
    setForm({
      title: doc.title,
      content: doc.content,
      agent_id: doc.agent_id || "",
      source_url: doc.source_url || "",
    });
  }

  async function removeDoc(id: string) {
    const res = await apiFetch(`/api/knowledge?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setDocs((prev) => prev.filter((d) => d.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm({ title: "", content: "", agent_id: "", source_url: "" });
      }
    } else {
      setError(res.error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ghost-white">Knowledge Base</h1>
      <p className="mt-1 text-on-surface-variant">
        Add FAQs and business info your agents use during live calls.
      </p>
      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      <form onSubmit={saveDoc} className="mt-8 surface-card space-y-4 p-6">
        <h2 className="font-semibold">{editingId ? "Edit document" : "Add document"}</h2>
        <input
          className="input-field"
          placeholder="Title (e.g. Business hours)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="input-field min-h-32"
          placeholder="Content your agent should know"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <input
          className="input-field"
          placeholder="Source URL (optional)"
          value={form.source_url}
          onChange={(e) => setForm({ ...form, source_url: e.target.value })}
        />
        <select
          className="input-field"
          value={form.agent_id}
          onChange={(e) => setForm({ ...form, agent_id: e.target.value })}
        >
          <option value="">All agents</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            {editingId ? "Save changes" : "Add document"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEditingId(null);
                setForm({ title: "", content: "", agent_id: "", source_url: "" });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {loading ? (
          <p className="text-slate-text">Loading…</p>
        ) : docs.length === 0 ? (
          <p className="text-slate-text">No knowledge documents yet.</p>
        ) : (
          docs.map((doc) => (
            <div key={doc.id} className="surface-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{doc.title}</h3>
                  <p className="mt-2 text-sm text-on-surface-variant line-clamp-3">{doc.content}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => startEdit(doc)} className="btn-secondary text-xs">
                    Edit
                  </button>
                  <button type="button" onClick={() => removeDoc(doc.id)} className="btn-secondary text-xs">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
