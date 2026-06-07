"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type Member = {
  id: string;
  user_id: string;
  role: string;
  email: string;
  created_at: string;
};

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch<{ members: Member[]; currentRole: string }>("/api/team").then((res) => {
      if (!active) return;
      if (res.ok) {
        setMembers(res.data.members || []);
        setCurrentRole(res.data.currentRole);
      } else {
        setError(res.error);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const canManage = currentRole === "owner" || currentRole === "admin";

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    const res = await apiFetch<{ member: Member }>("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    if (res.ok) {
      setMembers((prev) => [...prev, res.data.member]);
      setEmail("");
      setMessage("Member added.");
    } else {
      setError(res.error);
    }
  }

  async function updateRole(id: string, newRole: string) {
    const res = await apiFetch("/api/team", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole }),
    });
    if (res.ok) {
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role: newRole } : m)));
    } else {
      setError(res.error);
    }
  }

  async function removeMember(id: string) {
    const res = await apiFetch(`/api/team?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } else {
      setError(res.error);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="font-display text-2xl text-brand-900">Team</h1>
        <p className="mt-1 text-slate-500">Invite teammates with role-based access.</p>
      </header>

      {message && <p className="text-sm text-teal-700">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {canManage && (
        <form onSubmit={addMember} className="surface-card space-y-4 p-6">
          <h2 className="font-semibold">Add member</h2>
          <p className="text-sm text-slate-500">User must already have an Intellivo account.</p>
          <input
            className="input-field"
            type="email"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin — full settings access</option>
            <option value="operator">Operator — manage agents & calls</option>
            <option value="viewer">Viewer — read only</option>
          </select>
          <button type="submit" className="btn-primary">
            Add to team
          </button>
        </form>
      )}

      <div className="surface-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Joined</th>
              {canManage && <th className="px-5 py-3" />}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="px-5 py-3 font-medium">Owner (you)</td>
              <td className="px-5 py-3">owner</td>
              <td className="px-5 py-3">—</td>
              {canManage && <td className="px-5 py-3" />}
            </tr>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="border-t border-slate-100">
                  <td className="px-5 py-3">{m.email}</td>
                  <td className="px-5 py-3">
                    {canManage ? (
                      <select
                        className="input-field w-auto py-1 text-sm"
                        value={m.role}
                        onChange={(e) => updateRole(m.id, e.target.value)}
                      >
                        <option value="admin">admin</option>
                        <option value="operator">operator</option>
                        <option value="viewer">viewer</option>
                      </select>
                    ) : (
                      m.role
                    )}
                  </td>
                  <td className="px-5 py-3">{new Date(m.created_at).toLocaleDateString()}</td>
                  {canManage && (
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        className="text-sm text-red-600 hover:underline"
                        onClick={() => removeMember(m.id)}
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
