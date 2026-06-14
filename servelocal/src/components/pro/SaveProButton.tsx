"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

export function SaveProButton({ providerId }: { providerId: string }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/saved-providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId }),
      });
      const data = await res.json();
      if (res.ok) setSaved(data.saved);
      else if (res.status === 401) window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        saved
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted hover:border-amber-400/50"
      }`}
    >
      <Bookmark className={`h-4 w-4 ${saved ? "fill-primary" : ""}`} />
      {saved ? "Saved" : "Save Pro"}
    </button>
  );
}
