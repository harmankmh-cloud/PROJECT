"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Call } from "@/lib/types";
import { apiFetch } from "@/lib/api-client";

type TranscriptRow = {
  id: string;
  role: string;
  content: string;
  created_at: string;
};

export default function CallDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [call, setCall] = useState<Call | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch<{ call: Call; transcripts: TranscriptRow[] }>(`/api/calls/${id}`).then((res) => {
      if (!active) return;
      if (res.ok) {
        setCall(res.data.call);
        setTranscripts(res.data.transcripts || []);
      } else {
        setError(res.error);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <p className="text-sm text-slate-400">Loading call…</p>;
  }

  if (error || !call) {
    return (
      <div>
        <p className="text-sm text-red-600">{error || "Call not found"}</p>
        <Link href="/dashboard/calls" className="link-accent mt-4 inline-block text-sm">
          ← Back to calls
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href="/dashboard/calls" className="text-sm text-teal-600 hover:underline">
          ← Call logs
        </Link>
        <h1 className="font-display mt-2 text-2xl text-brand-900">Call detail</h1>
        <p className="mt-1 text-sm text-slate-500">
          {call.from_number || "Unknown"} · {new Date(call.created_at).toLocaleString()}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface-card p-4">
          <p className="text-xs text-slate-500">Direction</p>
          <p className="font-semibold capitalize">{call.direction}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs text-slate-500">Duration</p>
          <p className="font-semibold">{call.duration_seconds || 0}s</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs text-slate-500">Quality score</p>
          <p className="font-semibold">{call.score ?? "—"}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs text-slate-500">Sentiment</p>
          <p className="font-semibold capitalize">{call.sentiment || "—"}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs text-slate-500">Intent</p>
          <p className="font-semibold">{call.intent || "—"}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs text-slate-500">Transferred</p>
          <p className="font-semibold">{call.transferred ? "Yes" : "No"}</p>
        </div>
      </div>

      {((call.topics && call.topics.length > 0) || (call.action_items && call.action_items.length > 0)) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {call.topics && call.topics.length > 0 && (
            <div className="surface-card p-5">
              <h2 className="font-semibold text-brand-900">Topics</h2>
              <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
                {call.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          {call.action_items && call.action_items.length > 0 && (
            <div className="surface-card p-5">
              <h2 className="font-semibold text-brand-900">Action items</h2>
              <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
                {call.action_items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {call.summary && (
        <div className="surface-card p-5">
          <h2 className="font-semibold text-brand-900">Summary</h2>
          <p className="mt-2 text-sm text-slate-600">{call.summary}</p>
        </div>
      )}

      <div className="surface-card overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold">Transcript</h2>
        </div>
        <div className="max-h-[32rem] space-y-3 overflow-y-auto p-5">
          {transcripts.length === 0 ? (
            <p className="text-sm text-slate-400">No transcript lines recorded for this call.</p>
          ) : (
            transcripts.map((row) => (
              <div
                key={row.id}
                className={`rounded-xl px-4 py-3 text-sm ${
                  row.role === "assistant"
                    ? "bg-teal-50 text-teal-900"
                    : row.role === "user"
                      ? "bg-slate-50 text-slate-800"
                      : "bg-violet-50 text-violet-900"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide opacity-60">{row.role}</p>
                <p className="mt-1 whitespace-pre-wrap">{row.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
