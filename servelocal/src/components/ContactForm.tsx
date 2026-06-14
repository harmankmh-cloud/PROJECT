"use client";

import { useState } from "react";
import { formatSubmitError } from "@/lib/form-utils";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send message");
      setDone(true);
    } catch (err) {
      setError(formatSubmitError(err instanceof Error ? err.message : "Something went wrong"));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="surface-card p-8 text-center">
        <p className="text-3xl">✓</p>
        <h2 className="font-display mt-3 text-xl text-brand-950">Message sent</h2>
        <p className="mt-2 text-sm text-slate-600">We typically reply within 1–2 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card space-y-4 p-6 sm:p-8">
      <label className="block space-y-2 text-sm">
        <span className="font-semibold">Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold">Subject</span>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} className="input-field" placeholder="Listing help, billing, general…" />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-semibold">Message</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="input-field min-h-32 resize-y" required minLength={10} />
      </label>
      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading} className="btn-gold w-full py-3 disabled:opacity-60">
        {loading ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
