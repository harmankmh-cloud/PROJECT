"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Agent } from "@/lib/types";
import Link from "next/link";
import { DashboardDetailSkeleton } from "@/components/ui/DashboardPageSkeleton";
import { apiFetch } from "@/lib/api-client";
import { fetchTrialStatus } from "@/lib/trial-client";
import { SANDBOX_MAX_TEST_CALLS, TRIAL_MARKETING } from "@/lib/trial";

type Message = { role: "user" | "assistant"; content: string };

function SandboxContent() {
  const searchParams = useSearchParams();
  const preferredAgentId = searchParams.get("agent") || "";
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentId, setAgentId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [callMessage, setCallMessage] = useState("");
  const [calling, setCalling] = useState(false);
  const [trialInfo, setTrialInfo] = useState<string>("");
  const [voiceAvailable, setVoiceAvailable] = useState<boolean | null>(null);
  const [voiceNotice, setVoiceNotice] = useState("");

  useEffect(() => {
    apiFetch<{ voiceAvailable: boolean; message?: string }>("/api/sandbox/telephony-status").then(
      (res) => {
        if (!res.ok) return;
        setVoiceAvailable(res.data.voiceAvailable);
        if (!res.data.voiceAvailable && res.data.message) {
          setVoiceNotice(res.data.message);
        }
      }
    );
  }, []);

  useEffect(() => {
    fetchTrialStatus().then((status) => {
      if (!status) return;
      if (status.onTrial) {
        setTrialInfo(
          `${status.trialMinutesRemaining} trial minutes left · ${status.sandboxTestCallsRemaining} of ${SANDBOX_MAX_TEST_CALLS} test calls left`
        );
      }
    });
  }, []);

  useEffect(() => {
    apiFetch<{ agents: Agent[] }>("/api/agents").then((res) => {
      if (res.ok) {
        const list = res.data.agents || [];
        setAgents(list);
        const preferred =
          preferredAgentId && list.some((a) => a.id === preferredAgentId)
            ? preferredAgentId
            : list[0]?.id;
        if (preferred) setAgentId(preferred);
      }
    });
  }, [preferredAgentId]);

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

  async function testCall(e: React.FormEvent) {
    e.preventDefault();
    if (!agentId || !testPhone.trim()) return;
    setCalling(true);
    setCallMessage("");
    setError("");
    const res = await apiFetch<{ message?: string }>("/api/sandbox/test-call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: agentId, phone: testPhone }),
    });
    setCalling(false);
    if (res.ok) setCallMessage(res.data.message || "Test call started.");
    else setError(res.error);
  }

  return (
    <div className="dashboard-container mx-auto max-w-3xl space-y-6 pb-8">
      <header>
        <h1 className="font-display text-2xl font-bold text-on-surface">Agent sandbox</h1>
        <p className="mt-1 text-on-primary-container">
          Text chat is always free. Voice test calls are capped at 1 minute each.
        </p>
        {trialInfo && <p className="mt-2 text-sm text-amber-200">{trialInfo}</p>}
      </header>

      {trialInfo && (
        <p className="text-sm text-muted">
          Ready for production?{" "}
          <Link href="/dashboard/billing" className="text-primary-glow hover:underline">
            {TRIAL_MARKETING.goLiveCta}
          </Link>
        </p>
      )}

      {voiceAvailable === null ? (
        <div className="h-14 animate-pulse rounded-xl bg-surface-container-high" aria-hidden />
      ) : voiceAvailable === false && voiceNotice ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {voiceNotice}{" "}
          <Link href="/help/sandbox-testing" className="font-medium text-amber-50 underline">
            Learn more
          </Link>
        </div>
      ) : null}

      <form
        onSubmit={testCall}
        className={`surface-card flex flex-col gap-3 p-5 sm:flex-row sm:items-end ${voiceAvailable === false ? "opacity-60" : ""}`}
      >
        <div className="flex-1">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-text">
            Call my phone
          </label>
          <input
            className="input-field"
            placeholder="+1 604 555 0100"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            disabled={voiceAvailable === false}
          />
        </div>
        <button
          type="submit"
          disabled={calling || !agentId || voiceAvailable === false}
          className="btn-primary rounded-xl px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {calling ? "Calling…" : "Start test call"}
        </button>
      </form>
      {callMessage && <p className="text-sm text-primary">{callMessage}</p>}

      <div className="flex flex-wrap gap-3">
        <select
          className="agent-field w-auto"
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
        <button
          type="button"
          className="rounded-lg border border-outline-variant/30 px-4 py-2 text-sm font-semibold text-slate-text hover:bg-surface-container-low"
          onClick={() => setMessages([])}
        >
          Reset conversation
        </button>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="glass-panel min-h-[24rem] space-y-3 overflow-y-auto rounded-xl p-5">
        {messages.length === 0 ? (
          <p className="text-sm text-on-primary-container">Send a message to simulate a caller.</p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-xl px-4 py-3 text-sm ${
                m.role === "assistant"
                  ? "bg-electric-blue/10 text-on-surface"
                  : "bg-surface-container-low text-slate-text"
              }`}
            >
              <p className="text-xs font-semibold uppercase opacity-60">{m.role}</p>
              <p className="mt-1 whitespace-pre-wrap">{m.content}</p>
            </div>
          ))
        )}
        {loading && <p className="text-sm text-on-primary-container">Agent is typing…</p>}
      </div>

      <form onSubmit={send} className="flex gap-3">
        <input
          className="agent-field flex-1"
          placeholder="Type as if you're calling…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading || !agentId}
        />
        <button
          type="submit"
          className="btn-primary rounded-xl px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading || !agentId}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default function SandboxPage() {
  return (
    <Suspense fallback={<DashboardDetailSkeleton />}>
      <SandboxContent />
    </Suspense>
  );
}
