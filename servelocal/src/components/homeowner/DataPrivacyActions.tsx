"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function DataPrivacyActions() {
  const [loading, setLoading] = useState<"export" | "delete" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function exportData() {
    setLoading("export");
    setMessage(null);
    const res = await fetch("/api/account/export");
    setLoading(null);
    if (!res.ok) {
      setMessage("Export failed. Try again or email hello@servelocal.ca.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "servelocal-data-export.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Download started.");
  }

  async function requestDeletion() {
    if (!confirm("Request account deletion? We will process this within 30 days per PIPEDA.")) return;
    setLoading("delete");
    setMessage(null);
    const res = await fetch("/api/account/delete-request", { method: "POST" });
    setLoading(null);
    const data = await res.json().catch(() => ({}));
    setMessage(res.ok ? data.message : data.error || "Request failed.");
  }

  return (
    <section className="mt-10 max-w-lg rounded-[14px] border border-border bg-surface p-6">
      <h2 className="font-display text-lg font-bold text-foreground">Privacy (PIPEDA)</h2>
      <p className="mt-2 text-sm text-muted">
        Export your data or request deletion of your account and personal information.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" variant="outline" disabled={loading === "export"} onClick={exportData}>
          {loading === "export" ? "Preparing…" : "Export my data"}
        </Button>
        <Button type="button" variant="outline" disabled={loading === "delete"} onClick={requestDeletion}>
          {loading === "delete" ? "Submitting…" : "Request account deletion"}
        </Button>
      </div>
      {message ? <p className="mt-3 text-sm text-muted">{message}</p> : null}
    </section>
  );
}
