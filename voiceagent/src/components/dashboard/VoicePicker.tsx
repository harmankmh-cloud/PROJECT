"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { apiFetch } from "@/lib/api-client";

type VoiceItem = {
  id: string;
  provider: string;
  name: string;
  gender: string;
  accent: string;
  language: string;
  description: string;
};

export function VoicePicker({
  value,
  onChange,
  agentId,
  sampleText,
}: {
  value: string;
  onChange: (voiceId: string, language: string, provider: string) => void;
  agentId?: string;
  sampleText?: string;
}) {
  const [voices, setVoices] = useState<VoiceItem[]>([]);
  const [previewing, setPreviewing] = useState<string | null>(null);
  const [hint, setHint] = useState("");

  useEffect(() => {
    apiFetch<{ voices: VoiceItem[] }>("/api/voices").then((res) => {
      if (res.ok) setVoices(res.data.voices || []);
    });
  }, []);

  async function preview(voiceId: string) {
    if (!agentId) {
      setHint("Save the agent first to preview voice settings.");
      return;
    }
    setPreviewing(voiceId);
    setHint("");
    const res = await apiFetch<{ hint?: string; message?: string }>(
      `/api/agents/${agentId}/preview-voice`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voice_id: voiceId, text: sampleText }),
      }
    );
    setPreviewing(null);
    if (res.ok) {
      setHint(res.data.hint || res.data.message || "Voice selected.");
    } else {
      setHint(res.error);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {voices.map((voice) => {
          const selected = value === voice.id;
          return (
            <button
              key={voice.id}
              type="button"
              onClick={() => onChange(voice.id, voice.language, voice.provider)}
              className={`rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-primary/50 bg-primary/10 shadow-[0_0_16px_rgba(79,219,200,0.12)]"
                  : "border-glass-border-subtle bg-surface-container/60 hover:border-primary/30"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-ghost-white">{voice.name}</p>
                  <p className="mt-1 text-xs text-slate-text">
                    {voice.accent} · {voice.gender}
                  </p>
                  <p className="mt-2 text-[11px] text-on-surface-variant">{voice.description}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    void preview(voice.id);
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-glass-border-subtle bg-surface-container text-primary hover:bg-primary/10"
                  aria-label={`Preview ${voice.name}`}
                >
                  <MaterialIcon
                    name={previewing === voice.id ? "hourglass_top" : "volume_up"}
                    className="text-[18px]"
                  />
                </button>
              </div>
            </button>
          );
        })}
      </div>
      {hint && <p className="text-xs text-primary">{hint}</p>}
    </div>
  );
}
