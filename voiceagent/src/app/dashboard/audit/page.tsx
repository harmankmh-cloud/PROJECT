"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type AuditLog = {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  user_id: string | null;
};

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ logs: AuditLog[] }>("/api/audit").then((res) => {
      if (res.ok) setLogs(res.data.logs || []);
      else setError(res.error);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="font-display text-2xl text-brand-900">Audit log</h1>
        <p className="mt-1 text-slate-500">Compliance trail of settings, team, and API changes.</p>
      </header>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && <p className="text-slate-400">Loading…</p>}

      <div className="surface-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3">Time</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">Resource</th>
              <th className="px-5 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && !loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                  No audit events yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 font-medium">{log.action}</td>
                  <td className="px-5 py-3">
                    {log.resource_type}
                    {log.resource_id ? ` · ${log.resource_id.slice(0, 8)}…` : ""}
                  </td>
                  <td className="max-w-xs truncate px-5 py-3 text-slate-500">
                    {log.metadata ? JSON.stringify(log.metadata) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
