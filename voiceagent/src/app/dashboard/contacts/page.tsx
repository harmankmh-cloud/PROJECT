"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import type { Contact } from "@/lib/types";
import { apiFetch } from "@/lib/api-client";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ contacts: Contact[] }>("/api/contacts").then((res) => {
      if (res.ok) setContacts(res.data.contacts || []);
      else setError(res.error);
      setLoading(false);
    });
  }, []);

  return (
    <div className="dashboard-container pb-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ghost-white">Contacts</h1>
        <p className="mt-2 text-on-surface-variant">
          Caller memory from completed calls — names and interaction history.
        </p>
      </header>

      {error && <p className="mb-4 text-sm text-error">{error}</p>}

      {loading ? (
        <p className="text-slate-text">Loading contacts…</p>
      ) : contacts.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <MaterialIcon name="contacts" className="mb-4 text-5xl text-slate-text" />
          <p className="text-on-surface-variant">No contacts yet. They appear after live calls complete.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div key={c.id} className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-semibold text-ghost-white">{c.name || "Unknown caller"}</p>
                <p className="text-sm text-on-surface-variant">{c.phone_number}</p>
                {c.email && <p className="text-xs text-slate-text">{c.email}</p>}
              </div>
              <div className="text-right text-xs text-slate-text">
                {c.last_call_at
                  ? `Last call ${new Date(c.last_call_at).toLocaleDateString()}`
                  : "No calls yet"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
