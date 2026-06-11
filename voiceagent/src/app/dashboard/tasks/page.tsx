"use client";

import Link from "next/link";
import { CheckCircle2, Circle, PhoneCall, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Call } from "@/lib/types";
import { apiFetch } from "@/lib/api-client";

const DONE_KEY = "greetq-task-done";
const ACTIVE_STATUSES = new Set(["ringing", "in-progress", "in_progress", "answered"]);

type Task = {
  id: string;
  text: string;
  callId: string;
  from: string;
  intent: string | null;
  createdAt: string;
};

function loadLocalDone(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(DONE_KEY) || "[]") as string[]);
  } catch {
    return new Set();
  }
}

function saveLocalDone(done: Set<string>) {
  localStorage.setItem(DONE_KEY, JSON.stringify([...done]));
}

export default function TasksPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Set<string>>(() => loadLocalDone());
  const [filter, setFilter] = useState<"open" | "all">("open");

  const persistDone = useCallback((next: Set<string>) => {
    saveLocalDone(next);
    void apiFetch<{ completed: string[] }>("/api/tasks/completed", {
      method: "PUT",
      body: JSON.stringify({ completed: [...next] }),
    });
  }, []);

  useEffect(() => {
    let active = true;
    void apiFetch<{ completed: string[] }>("/api/tasks/completed").then((res) => {
      if (!active || !res.ok) return;
      const remote = new Set(res.data.completed || []);
      setDone((prev) => {
        const merged = new Set([...prev, ...remote]);
        saveLocalDone(merged);
        return merged;
      });
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const fetchCalls = () => {
      apiFetch<{ calls: Call[] }>("/api/calls").then((res) => {
        if (!active) return;
        if (res.ok) setCalls(res.data.calls || []);
        else setError(res.error);
        setLoading(false);
      });
    };
    fetchCalls();
    const interval = setInterval(fetchCalls, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const activeCalls = useMemo(
    () => calls.filter((c) => ACTIVE_STATUSES.has((c.status || "").toLowerCase())),
    [calls]
  );

  const tasks = useMemo<Task[]>(() => {
    const out: Task[] = [];
    for (const call of calls) {
      for (const [i, item] of (call.action_items || []).entries()) {
        out.push({
          id: `${call.id}:${i}`,
          text: item,
          callId: call.id,
          from: call.from_number || "Unknown caller",
          intent: call.intent ?? null,
          createdAt: call.created_at,
        });
      }
    }
    return out;
  }, [calls]);

  const visible = filter === "open" ? tasks.filter((t) => !done.has(t.id)) : tasks;
  const openCount = tasks.filter((t) => !done.has(t.id)).length;

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      persistDone(next);
      return next;
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ghost-white">Tasks</h1>
          <p className="mt-1 text-on-surface-variant">
            Action items extracted from your calls by AI. {openCount} open.
          </p>
        </div>
        <div className="flex gap-2">
          {(["open", "all"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                filter === f
                  ? "bg-violet-600/20 font-medium text-violet-300"
                  : "text-muted hover:text-text"
              }`}
            >
              {f === "open" ? "Open" : "All"}
            </button>
          ))}
        </div>
      </div>

      {activeCalls.length > 0 ? (
        <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            {activeCalls.length} call{activeCalls.length > 1 ? "s" : ""} in progress right now
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {activeCalls.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/calls/${c.id}`}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text transition hover:border-emerald-500/40"
              >
                <PhoneCall className="h-4 w-4 text-emerald-400" />
                {c.from_number || "Unknown"} · live transcript
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {error ? <p className="mt-6 text-sm text-error">{error}</p> : null}
      {loading ? (
        <p className="mt-6 flex items-center gap-2 text-sm text-muted">
          <RefreshCw className="h-4 w-4 animate-spin" /> Loading tasks…
        </p>
      ) : null}

      {!loading && visible.length === 0 ? (
        <div className="surface-card mt-8 p-10 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400/70" />
          <p className="mt-4 font-medium text-text">
            {tasks.length === 0 ? "No action items yet" : "All caught up"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {tasks.length === 0
              ? "When calls complete, AI-extracted follow-ups land here."
              : "Every action item from your calls is handled."}
          </p>
        </div>
      ) : null}

      <ul className="mt-8 space-y-3">
        {visible.map((task) => {
          const isDone = done.has(task.id);
          return (
            <li
              key={task.id}
              className={`surface-card flex items-start gap-3 p-4 transition ${isDone ? "opacity-50" : ""}`}
            >
              <button
                type="button"
                aria-label={isDone ? "Mark as open" : "Mark as done"}
                onClick={() => toggle(task.id)}
                className="mt-0.5 shrink-0 text-muted transition hover:text-violet-300"
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p className={`text-sm text-text ${isDone ? "line-through" : ""}`}>{task.text}</p>
                <p className="mt-1 text-xs text-muted">
                  {task.from}
                  {task.intent ? ` · ${task.intent}` : ""} ·{" "}
                  {new Date(task.createdAt).toLocaleString("en-CA", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <Link
                href={`/dashboard/calls/${task.callId}`}
                className="shrink-0 text-xs text-violet-400 transition hover:text-violet-300"
              >
                View call →
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
