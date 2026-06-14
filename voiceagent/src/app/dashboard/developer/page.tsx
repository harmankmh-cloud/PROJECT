"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { APP_URL, BRAND } from "@/lib/brand";

type ApiKey = {
  id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  created_at: string;
};

export default function DeveloperPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [name, setName] = useState("Production");
  const [newSecret, setNewSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ keys: ApiKey[] }>("/api/api-keys").then((res) => {
      if (res.ok) setKeys(res.data.keys || []);
      else setError(res.error);
      setLoading(false);
    });
  }, []);

  async function createKey(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNewSecret("");
    const res = await apiFetch<{ key: ApiKey; secret: string }>("/api/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setKeys((prev) => [res.data.key, ...prev]);
      setNewSecret(res.data.secret);
    } else {
      setError(res.error);
    }
  }

  async function revokeKey(id: string) {
    const res = await apiFetch(`/api/api-keys?id=${id}`, { method: "DELETE" });
    if (res.ok) setKeys((prev) => prev.filter((k) => k.id !== id));
    else setError(res.error);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="font-display text-2xl text-ghost-white">Developer</h1>
        <p className="mt-1 text-on-surface-variant">API keys and webhooks for your integrations.</p>
      </header>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="surface-card space-y-4 p-6">
        <h2 className="font-semibold">REST API</h2>
        <p className="text-sm text-on-surface-variant">
          List recent calls with your API key:
        </p>
        <code className="block rounded-xl bg-slate-900 px-4 py-3 text-sm text-teal-300">
          curl -H &quot;Authorization: Bearer grtq_…&quot; {APP_URL}/api/v1/calls
        </code>
      </div>

      <form onSubmit={createKey} className="surface-card space-y-4 p-6">
        <h2 className="font-semibold">API keys</h2>
        <input
          className="input-field"
          placeholder="Key name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          Create API key
        </button>
        {newSecret && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <p className="font-semibold text-amber-900">Copy this key now — it won&apos;t be shown again:</p>
            <code className="mt-2 block break-all text-amber-800">{newSecret}</code>
          </div>
        )}
      </form>

      <div className="surface-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container text-on-surface-variant">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Prefix</th>
              <th className="px-5 py-3">Last used</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-slate-text">
                  Loading…
                </td>
              </tr>
            ) : keys.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-text">
                  No API keys yet.
                </td>
              </tr>
            ) : (
              keys.map((k) => (
                <tr key={k.id} className="border-t border-slate-100">
                  <td className="px-5 py-3">{k.name}</td>
                  <td className="px-5 py-3 font-mono text-xs">{k.key_prefix}…</td>
                  <td className="px-5 py-3">
                    {k.last_used_at ? new Date(k.last_used_at).toLocaleString() : "Never"}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      className="text-sm text-error hover:underline"
                      onClick={() => revokeKey(k.id)}
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="surface-card space-y-3 p-6 text-sm text-on-surface-variant">
        <h2 className="font-semibold text-ghost-white">Outbound webhooks</h2>
        <p>
          Configure your webhook URL in <strong>Settings</strong>. {BRAND.name} sends a signed{" "}
          <code className="text-xs">call.completed</code> event after each call with transcript analysis.
        </p>
      </div>
    </div>
  );
}
