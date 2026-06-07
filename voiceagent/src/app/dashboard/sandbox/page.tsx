"use client";

import { useEffect, useState } from "react";
import type { Agent } from "@/lib/types";
import { apiFetch } from "@/lib/api-client";

type Message = { role: "user" | "assistant"; content: string };

export default function SandboxPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentId, setAgentId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ agents: Agent[] }>("/api/agents").then((res) => {
      if (res.ok) {
        const list = res.data.agents || [];
        setAgents(list);
        if (list[0]) setAgentId(list[0].id);
      }
    });
  }, []);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !agentId) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");

    const res = await apiFetch<{ reply: string }>("/api/sandbox/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: agentId, messages: nextMessages }),
    });

    setLoading(false);
    if (res.ok) {
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } else {
      setError(res.error);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="font-display text-2xl text-brand-900">Agent sandbox</h1>
        <p className="mt-1 text-slate-500">Test your agent in text before going live on the phone.</p>
      </header>

      <div className="flex flex-wrap gap-3">
        <select
          className="input-field w-auto"
          value={agentId}
          onChange={(e) => {
            setAgentId(e.target.value);
            setMessages([]);
          }}
        >
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <button type="button" className="btn-ghost" onClick={() => setMessages([])}>
          Reset conversation
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="surface-card min-h-[24rem] space-y-3 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-400">Send a message to simulate a caller.</p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-xl px-4 py-3 text-sm ${
                m.role === "assistant" ? "bg-teal-50 text-teal-900" : "bg-slate-50 text-slate-800"
              }`}
            >
              <p className="text-xs font-semibold uppercase opacity-60">{m.role}</p>
              <p className="mt-1 whitespace-pre-wrap">{m.content}</p>
            </div>
          ))
        )}
        {loading && <p className="text-sm text-slate-400">Agent is typing…</p>}
      </div>

      <form onSubmit={send} className="flex gap-3">
        <input
          className="input-field flex-1"
          placeholder="Type as if you're calling…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading || !agentId}
        />
        <button type="submit" className="btn-primary" disabled={loading || !agentId}>
          Send
        </button>
      </form>
    </div>
  );
}
