"use client";

import { useState } from "react";

type Props = {
  initialText?: string;
};

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

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
    await copyText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Marketing helpers</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Paste a good review and create social posts or public replies.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-4 min-h-32 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
          placeholder="Paste a customer review here"
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => generate("caption")}
            disabled={loading !== null}
            className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading === "caption" ? "Working..." : "Make social caption"}
          </button>
          <button
            type="button"
            onClick={() => generate("reply")}
            disabled={loading !== null}
            className="rounded-2xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 disabled:opacity-60"
          >
            {loading === "reply" ? "Working..." : "Make review reply"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {caption && (
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-zinc-800">Social caption</p>
              <button
                type="button"
                onClick={() => handleCopy("caption", caption)}
                className="text-sm font-medium text-emerald-700"
              >
                {copied === "caption" ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{caption}</p>
          </div>
        )}
        {reply && (
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-zinc-800">Review reply</p>
              <button
                type="button"
                onClick={() => handleCopy("reply", reply)}
                className="text-sm font-medium text-emerald-700"
              >
                {copied === "reply" ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{reply}</p>
          </div>
        )}
      </div>
    </div>
  );
}
