"use client";

import { useState } from "react";
import { copyToClipboard } from "@/lib/copy";

type Props = {
  initialText?: string;
};

export function AiToolsPanel({ initialText = "" }: Props) {
  const [text, setText] = useState(initialText);
  const [caption, setCaption] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState<"caption" | "reply" | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"caption" | "reply" | null>(null);

  async function generate(type: "caption" | "reply") {
    if (text.trim().length < 3) {
      setError("Paste at least one full sentence from a customer review.");
      return;
    }

    setLoading(type);
    setError("");

    try {
      const response = await fetch("/api/ai/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, text }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not generate content");

      if (type === "caption") setCaption(data.result || "");
      if (type === "reply") setReply(data.result || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate content");
    } finally {
      setLoading(null);
    }
  }

  async function handleCopy(type: "caption" | "reply", value: string) {
    setError("");
    try {
      await copyToClipboard(value);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Copy failed");
    }
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-[#e8e2d9] bg-brand-950 px-6 py-4">
        <h2 className="font-display text-lg text-white">Marketing studio</h2>
        <p className="mt-0.5 text-sm text-white/60">Turn reviews into social posts and owner replies</p>
      </div>
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="border-b border-[#e8e2d9] p-6 lg:border-b-0 lg:border-r">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-field min-h-36 resize-y"
            placeholder="Paste a customer review here…"
          />
          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => generate("caption")}
              disabled={loading !== null}
              className="btn-gold py-2.5 text-sm disabled:opacity-60"
            >
              {loading === "caption" ? "Writing…" : "Instagram caption"}
            </button>
            <button
              type="button"
              onClick={() => generate("reply")}
              disabled={loading !== null}
              className="btn-ghost py-2.5 text-sm disabled:opacity-60"
            >
              {loading === "reply" ? "Writing…" : "Owner reply"}
            </button>
          </div>
        </div>

        <div className="space-y-4 bg-cream p-6">
          {caption ? (
            <div className="rounded-xl border border-[#e8e2d9] bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wide text-stone-400">Caption</p>
                <button
                  type="button"
                  onClick={() => handleCopy("caption", caption)}
                  className="text-sm font-semibold text-gold-600"
                >
                  {copied === "caption" ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{caption}</p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#e8e2d9] p-6 text-center text-sm text-stone-400">
              Caption appears here
            </div>
          )}
          {reply ? (
            <div className="rounded-xl border border-[#e8e2d9] bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wide text-stone-400">Reply</p>
                <button
                  type="button"
                  onClick={() => handleCopy("reply", reply)}
                  className="text-sm font-semibold text-gold-600"
                >
                  {copied === "reply" ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{reply}</p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#e8e2d9] p-6 text-center text-sm text-stone-400">
              Reply appears here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
