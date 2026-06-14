"use client";

import Link from "next/link";
import { PhoneCall, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type LiveCall = {
  id: string;
  from_number: string | null;
  to_number: string | null;
  status: string;
  started_at: string | null;
  agent_id: string | null;
  is_sandbox: boolean | null;
};

export default function LiveCallsPage() {
  const [calls, setCalls] = useState<LiveCall[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const poll = () => {
      apiFetch<{ calls: LiveCall[] }>("/api/calls/live").then((res) => {
        if (!active) return;
        if (res.ok) {
          setCalls(res.data.calls || []);
          setError("");
        } else {
          setError(res.error);
        }
        setLoading(false);
      });
    };
    poll();
    const interval = setInterval(poll, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="dashboard-container space-y-8 py-8">
      <header>
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-emerald-400" />
          <h1 className="font-display text-2xl text-text md:text-3xl">Live calls</h1>
        </div>
        <p className="mt-1 text-sm text-muted">
          Active inbound calls right now. Refreshes every 5 seconds.
        </p>
      </header>

      {error ? <p className="text-sm text-error">{error}</p> : null}
      {loading ? <p className="text-sm text-muted">Checking for live calls…</p> : null}

      {!loading && calls.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <PhoneCall className="mx-auto h-10 w-10 text-muted" />
          <p className="mt-4 font-medium text-text">No calls in progress</p>
          <p className="mt-1 text-sm text-muted">
            When a call connects, it appears here with a link to the live transcript.
          </p>
          <Link href="/dashboard/sandbox" className="mt-4 inline-block text-sm text-violet-400 hover:text-violet-300">
            Run a sandbox test →
          </Link>
        </div>
      ) : null}

      <ul className="space-y-3">
        {calls.map((call) => (
          <li key={call.id} className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
              </span>
              <div>
                <p className="font-medium text-text">{call.from_number || "Unknown caller"}</p>
                <p className="text-xs text-muted">
                  {call.status}
                  {call.is_sandbox ? " · sandbox" : ""}
                  {call.started_at
                    ? ` · started ${new Date(call.started_at).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })}`
                    : ""}
                </p>
              </div>
            </div>
            <Link
              href={`/dashboard/calls/${call.id}`}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:border-emerald-500/50"
            >
              Open live transcript →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
