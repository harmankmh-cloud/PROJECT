"use client";

import { useEffect, useState } from "react";
import type { Agent } from "@/lib/types";
import { apiFetch } from "@/lib/api-client";

type PhoneNumber = {
  id: string;
  phone_number: string;
  label: string | null;
  agent_id: string | null;
  twilio_sid: string | null;
  va_agents?: { id: string; name: string } | { id: string; name: string }[] | null;
};

export default function PhoneNumbersPage() {
  const [numbers, setNumbers] = useState<PhoneNumber[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [form, setForm] = useState({ phone_number: "", label: "", agent_id: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [available, setAvailable] = useState<
    Array<{ phone_number: string; region: string; monthly_cost_cents: number }>
  >([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    Promise.all([
      apiFetch<{ phoneNumbers: PhoneNumber[] }>("/api/phone-numbers"),
      apiFetch<{ agents: Agent[] }>("/api/agents"),
    ]).then(([numsRes, agentsRes]) => {
      if (numsRes.ok) setNumbers(numsRes.data.phoneNumbers || []);
      else setError(numsRes.error);
      if (agentsRes.ok) setAgents(agentsRes.data.agents || []);
      setLoading(false);
    });
  }, []);

  async function addNumber(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const res = await apiFetch<{ phoneNumber: PhoneNumber }>("/api/phone-numbers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_number: form.phone_number,
        label: form.label || null,
        agent_id: form.agent_id || null,
      }),
    });

    if (res.ok) {
      setNumbers((prev) => [res.data.phoneNumber, ...prev]);
      setForm({ phone_number: "", label: "", agent_id: "" });
      setMessage("Phone number added. Point your Twilio number voice webhook to /api/twilio/voice.");
    } else {
      setError(res.error);
    }
  }

  async function assignAgent(id: string, agentId: string) {
    const res = await apiFetch<{ phoneNumber: PhoneNumber }>("/api/phone-numbers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, agent_id: agentId || null }),
    });
    if (res.ok) {
      setNumbers((prev) => prev.map((n) => (n.id === id ? res.data.phoneNumber : n)));
    } else {
      setError(res.error);
    }
  }

  async function removeNumber(id: string) {
    const res = await apiFetch(`/api/phone-numbers?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setNumbers((prev) => prev.filter((n) => n.id !== id));
    } else {
      setError(res.error);
    }
  }

  function agentName(record: PhoneNumber) {
    const linked = record.va_agents;
    if (!linked) return "Unassigned";
    const agent = Array.isArray(linked) ? linked[0] : linked;
    return agent?.name || "Unassigned";
  }

  async function searchNumbers(e: React.FormEvent) {
    e.preventDefault();
    setSearching(true);
    setError("");
    const q = areaCode ? `?area_code=${areaCode}` : "";
    const res = await apiFetch<{ numbers: typeof available }>(`/api/phone-numbers/search${q}`);
    setSearching(false);
    if (res.ok) setAvailable(res.data.numbers || []);
    else setError(res.error);
  }

  async function purchaseNumber(phone: string) {
    setError("");
    setMessage("");
    const res = await apiFetch<{ phoneNumber: PhoneNumber; message?: string }>(
      "/api/phone-numbers/purchase",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phone,
          agent_id: form.agent_id || agents[0]?.id || null,
        }),
      }
    );
    if (res.ok) {
      setNumbers((prev) => [res.data.phoneNumber, ...prev]);
      setMessage(res.data.message || "Number purchased.");
    } else {
      setError(res.error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ghost-white">Phone Numbers</h1>
      <p className="mt-1 text-on-surface-variant">
        Search Telnyx numbers or map an existing line. Inbound calls route by the number dialed.
      </p>

      {message && <p className="mt-4 text-sm text-primary">{message}</p>}
      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      <form onSubmit={searchNumbers} className="mt-8 surface-card flex flex-wrap items-end gap-4 p-6">
        <div>
          <h2 className="font-semibold text-ghost-white">Search Telnyx numbers</h2>
          <p className="mt-1 text-xs text-on-surface-variant">US numbers by area code (optional)</p>
        </div>
        <input
          className="input-field w-32"
          placeholder="604"
          value={areaCode}
          onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, "").slice(0, 3))}
        />
        <button type="submit" disabled={searching} className="btn-secondary">
          {searching ? "Searching…" : "Search"}
        </button>
      </form>

      {available.length > 0 && (
        <div className="mt-4 space-y-2">
          {available.map((n) => (
            <div
              key={n.phone_number}
              className="surface-card flex items-center justify-between gap-4 p-4"
            >
              <div>
                <p className="font-semibold text-ghost-white">{n.phone_number}</p>
                <p className="text-xs text-slate-text">
                  {n.region} · ${(n.monthly_cost_cents / 100).toFixed(2)}/mo
                </p>
              </div>
              <button
                type="button"
                onClick={() => void purchaseNumber(n.phone_number)}
                className="btn-primary text-xs"
              >
                Buy & assign
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={addNumber} className="mt-8 surface-card space-y-4 p-6">
        <h2 className="font-semibold">Add number</h2>
        <input
          className="input-field"
          placeholder="+15551234567"
          value={form.phone_number}
          onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
          required
        />
        <input
          className="input-field"
          placeholder="Label (e.g. Main line)"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
        <select
          className="input-field"
          value={form.agent_id}
          onChange={(e) => setForm({ ...form, agent_id: e.target.value })}
        >
          <option value="">No agent (use defaults)</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary">
          Add number
        </button>
      </form>

      <div className="mt-8 space-y-3">
        {loading ? (
          <p className="text-slate-text">Loading…</p>
        ) : numbers.length === 0 ? (
          <p className="text-slate-text">No phone numbers yet. Add your Twilio number above.</p>
        ) : (
          numbers.map((n) => (
            <div key={n.id} className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-semibold">{n.phone_number}</p>
                {n.label && <p className="text-sm text-on-surface-variant">{n.label}</p>}
                <p className="mt-1 text-xs text-slate-text">Agent: {agentName(n)}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="input-field max-w-[180px] text-sm"
                  value={n.agent_id || ""}
                  onChange={(e) => assignAgent(n.id, e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => removeNumber(n.id)} className="btn-secondary text-xs">
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
