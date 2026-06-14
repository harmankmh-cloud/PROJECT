"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UserRow = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed: boolean;
  business: { id: string; name: string; slug: string; plan: string } | null;
};

export function AdminUsersPanel() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load users");
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invite failed");
      setMessage(`Invite sent to ${email.trim()}. They can sign in after confirming email.`);
      setEmail("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invite failed");
    } finally {
      setInviting(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={invite} className="surface-card p-6">
        <h2 className="font-semibold text-brand-950">Invite a business owner</h2>
        <p className="mt-1 text-sm text-stone-600">
          Sends a Supabase invite email. After they join, add their business under{" "}
          <Link href="/admin/businesses" className="font-semibold text-gold-600 hover:underline">
            All businesses
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@shop.com"
            className="input-field flex-1"
          />
          <button type="submit" disabled={inviting} className="btn-gold px-5 py-2.5 disabled:opacity-50">
            {inviting ? "Sending…" : "Send invite"}
          </button>
        </div>
        {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
      </form>

      <div className="surface-card overflow-hidden">
        <div className="border-b border-[#e8e2d9] px-6 py-4">
          <h2 className="font-semibold text-brand-950">All accounts ({users.length})</h2>
        </div>
        {loading ? (
          <p className="px-6 py-8 text-sm text-stone-500">Loading…</p>
        ) : users.length === 0 ? (
          <p className="px-6 py-8 text-sm text-stone-500">No users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Business</th>
                  <th className="px-5 py-3">Confirmed</th>
                  <th className="px-5 py-3">Last sign-in</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-[#e8e2d9]">
                    <td className="px-5 py-3 font-medium">{u.email}</td>
                    <td className="px-5 py-3">
                      {u.business ? (
                        <Link
                          href={`/admin/business/${u.business.id}`}
                          className="text-gold-600 hover:underline"
                        >
                          {u.business.name}
                        </Link>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">{u.email_confirmed ? "Yes" : "Pending"}</td>
                    <td className="px-5 py-3 text-stone-500">
                      {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "Never"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
