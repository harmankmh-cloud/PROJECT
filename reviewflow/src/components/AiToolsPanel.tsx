"use client";

import { useState } from "react";

type Props = {
  initialText?: string;
};

export function AiToolsPanel({ initialText = "" }: Props) {
  const [text, setText] = useState(initialText);
  const [caption, setCaption] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState<"caption" | "reply" | null>(null);

  async function generate(type: "caption" | "reply") {
    if (text.trim().length < 3) return;
    setLoading(type);

    try {
      const response = await fetch("/api/ai/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, text }),
      });
      const data = await response.json();
      if (type === "caption") setCaption(data.result || "");
      if (type === "reply") setReply(data.result || "");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Marketing helpers</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Paste a good review and create social posts or replies.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-4 min-h-32 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
          placeholder="Paste a customer review here"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => generate("caption")}
            disabled={loading !== null}
            className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {loading === "caption" ? "Working..." : "Make social caption"}
          </button>
          <button
            type="button"
            onClick={() => generate("reply")}
            disabled={loading !== null}
            className="rounded-2xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800"
          >
            {loading === "reply" ? "Working..." : "Make review reply"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {caption && (
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm font-medium text-zinc-800">Social caption</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{caption}</p>
          </div>
        )}
        {reply && (
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm font-medium text-zinc-800">Review reply</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{reply}</p>
          </div>
        )}
      </div>
    </div>
  );
}
