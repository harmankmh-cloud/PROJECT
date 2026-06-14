"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CallDetailHeader } from "@/components/dashboard/CallDetailHeader";
import { DashboardDetailSkeleton } from "@/components/ui/DashboardPageSkeleton";
import { useToast } from "@/components/providers/ToastProvider";
import { MaterialIcon } from "@/components/MaterialIcon";
import { apiFetch } from "@/lib/api-client";
import { formatDuration } from "@/lib/format-duration";
import { formatTranscriptOffset } from "@/lib/format-transcript-time";
import { intentTag } from "@/lib/intent-display";
import type { Call } from "@/lib/types";

type TranscriptRow = {
  id: string;
  role: string;
  content: string;
  created_at: string;
};

function intentIcon(intent: string | null | undefined): string {
  const value = (intent || "").toLowerCase();
  if (value.includes("book") || value.includes("appoint") || value.includes("schedul")) {
    return "calendar_today";
  }
  if (value.includes("pric") || value.includes("quote") || value.includes("inquir")) {
    return "help";
  }
  if (value.includes("support") || value.includes("help")) {
    return "support_agent";
  }
  return "label";
}

function formatCallDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CallDetailPage() {
  const params = useParams();
  const { showError, showSuccess } = useToast();
  const id = params.id as string;
  const [call, setCall] = useState<Call | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [recordings, setRecordings] = useState<
    Array<{ id: string; storage_url: string | null; created_at: string }>
  >([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    apiFetch<{
      call: Call;
      transcripts: TranscriptRow[];
      recordings: Array<{ id: string; storage_url: string | null; created_at: string }>;
    }>(`/api/calls/${id}`).then((res) => {
      if (!active) return;
      if (res.ok) {
        setCall(res.data.call);
        setTranscripts(res.data.transcripts || []);
        setRecordings(res.data.recordings || []);
      } else {
        setLoadError(res.error);
        showError(res.error);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  async function syncToCrm() {
    setSyncing(true);
    const res = await apiFetch<{ provider?: string }>(`/api/calls/${id}/sync-crm`, {
      method: "POST",
    });
    setSyncing(false);
    if (res.ok) {
      showSuccess(`Synced to ${res.data.provider || "CRM"}`);
    } else {
      showError(res.error);
    }
  }

  async function copySummary() {
    const text =
      call?.summary ||
      transcripts.map((t) => `${t.role}: ${t.content}`).join("\n") ||
      "No summary available";
    try {
      await navigator.clipboard.writeText(text);
      showSuccess("Summary copied to clipboard");
    } catch {
      showError("Could not copy to clipboard");
    }
  }

  if (loading) {
    return <DashboardDetailSkeleton />;
  }

  if (loadError || !call) {
    return (
      <div className="dashboard-container py-12">
        <p className="text-error">{loadError || "Call not found"}</p>
        <Link href="/dashboard/calls" className="mt-4 inline-block text-sm font-semibold text-secondary hover:underline">
          Back to calls
        </Link>
      </div>
    );
  }

  const tag = intentTag(call.intent);
  const anchorTime = call.started_at || call.created_at;
  const transcriptAnchor = transcripts[0]?.created_at || anchorTime;

  return (
    <div className="pb-24">
      <CallDetailHeader />
      <main className="dashboard-container mx-auto max-w-lg pt-4">
        <section className="animate-pop-in mb-8">
          <div className="glass-panel rounded-xl p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-on-primary-container">
                  Caller Number
                </p>
                <h2 className="text-2xl font-bold text-on-surface">{call.from_number || "Unknown"}</h2>
              </div>
              <div className="flex shrink-0 items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-secondary">
                <MaterialIcon name={intentIcon(call.intent)} filled className="text-[16px]" />
                <span className="text-xs font-semibold">{tag.label}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/20 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container">
                  <MaterialIcon name="schedule" className="text-[20px] text-on-primary-container" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-primary-container">Duration</p>
                  <p className="text-sm font-semibold">{formatDuration(call.duration_seconds || 0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container">
                  <MaterialIcon name="event" className="text-[20px] text-on-primary-container" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-primary-container">Date</p>
                  <p className="text-sm font-semibold">{formatCallDate(call.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {recordings.length > 0 && (
          <section className="mb-8">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-text">
              Recording
            </h3>
            {recordings.map((r) =>
              r.storage_url ? (
                <audio
                  key={r.id}
                  controls
                  className="w-full rounded-xl"
                  src={r.storage_url}
                >
                  Your browser does not support audio playback.
                </audio>
              ) : null
            )}
          </section>
        )}

        <section className="mb-8 flex gap-3">
          <button
            type="button"
            onClick={() => void syncToCrm()}
            disabled={syncing}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary shadow-md transition-all active:scale-95 disabled:opacity-60"
          >
            <MaterialIcon name="sync" className={`text-[20px] ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing…" : "Sync to CRM"}
          </button>
          <button
            type="button"
            onClick={() => void copySummary()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-electric-blue py-3 text-sm font-semibold text-on-primary shadow-md transition-all active:scale-95"
          >
            <MaterialIcon name="content_copy" className="text-[20px]" />
            Copy Summary
          </button>
        </section>

        {call.summary && (
          <section className="mb-8">
            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-sm font-semibold text-on-surface">AI Summary</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-text">{call.summary}</p>
            </div>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-on-surface">Transcript</h3>
            <span className="rounded bg-surface-container px-2 py-1 text-xs font-semibold text-on-primary-container">
              {transcripts.length > 0 ? "Real-time" : "No lines"}
            </span>
          </div>
          <div className="transcript-container max-h-[32rem] space-y-4 overflow-y-auto">
            {transcripts.length === 0 ? (
              <p className="px-2 text-sm text-on-primary-container">
                No transcript lines recorded for this call.
              </p>
            ) : (
              transcripts.map((row) => {
                const isAgent = row.role === "assistant";
                const label = isAgent ? "GreetQ AI Agent" : row.role === "user" ? "Caller" : row.role;
                return (
                  <div
                    key={row.id}
                    className={`flex max-w-[85%] flex-col gap-1 ${isAgent ? "items-start" : "ml-auto items-end"}`}
                  >
                    <span
                      className={`px-2 text-xs font-semibold ${
                        isAgent ? "text-secondary" : "text-on-primary-container"
                      }`}
                    >
                      {label}
                    </span>
                    <div
                      className={`p-4 text-base shadow-sm ${
                        isAgent
                          ? "rounded-2xl rounded-tl-none bg-secondary-container text-on-secondary-container"
                          : "rounded-2xl rounded-tr-none border border-outline-variant/10 bg-surface-container-highest text-on-surface"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{row.content}</p>
                    </div>
                    <span className="px-2 text-[10px] text-on-primary-container">
                      {formatTranscriptOffset(transcriptAnchor, row.created_at)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <div className="h-20" />
      </main>
    </div>
  );
}
