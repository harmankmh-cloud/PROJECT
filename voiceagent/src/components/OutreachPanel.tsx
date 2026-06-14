"use client";

import { useState } from "react";

const VERTICALS = [
  "dental",
  "clinic",
  "hvac",
  "plumbing",
  "salon",
  "spa",
  "legal",
  "home_services",
] as const;

export function OutreachPanel({ adminEmail }: { adminEmail: string }) {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Abbotsford");
  const [vertical, setVertical] = useState<string>("dental");
  const [contactName, setContactName] = useState("");
  const [painNote, setPainNote] = useState("");
  const [sequence, setSequence] = useState<
    "initial" | "morning_call" | "followup_1" | "followup_2"
  >("initial");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState<"draft" | "preview" | "send" | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function run(action: "draft" | "preview" | "send") {
    setLoading(action);
    setError("");
    setMessage("");

    const payload = {
      business_name: businessName.trim(),
      email: email.trim(),
      city: city.trim(),
      vertical,
      contact_name: contactName.trim() || undefined,
      pain_note: painNote.trim() || undefined,
      sequence,
      send: action === "preview" || action === "send",
      preview_to: action === "preview" ? adminEmail : undefined,
    };

    try {
      const response = await fetch("/api/admin/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.hint || "Request failed");

      setSubject(data.subject || "");
      setBody(data.body || "");

      if (action === "draft") {
        setMessage("Draft ready — edit below, then send preview or send to lead.");
      } else if (action === "preview") {
        setMessage(`Preview sent to ${adminEmail}. Check your inbox.`);
      } else {
        setMessage(
          `Sent to ${data.to}${data.provider ? ` via ${data.provider}` : ""}. Id: ${data.email_id || data.resend_id || "ok"}`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <h2 className="font-semibold text-ghost-white">Lead details</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          No Make.com needed — AI writes the email here, Resend sends it.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-ghost-white">Business name</span>
            <input
              className="input-field mt-1 w-full"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Pacific Dental"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-ghost-white">Their email</span>
            <input
              type="email"
              className="input-field mt-1 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@example.com"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-ghost-white">City</span>
            <input
              className="input-field mt-1 w-full"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-ghost-white">Industry</span>
            <select
              className="input-field mt-1 w-full"
              value={vertical}
              onChange={(e) => setVertical(e.target.value)}
            >
              {VERTICALS.map((v) => (
                <option key={v} value={v}>
                  {v.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-ghost-white">Contact name (optional)</span>
            <input
              className="input-field mt-1 w-full"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-ghost-white">Pain note (optional)</span>
            <input
              className="input-field mt-1 w-full"
              value={painNote}
              onChange={(e) => setPainNote(e.target.value)}
              placeholder="After-hours calls go to voicemail"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-ghost-white">Sequence</span>
            <select
              className="input-field mt-1 w-full"
              value={sequence}
              onChange={(e) => setSequence(e.target.value as typeof sequence)}
            >
              <option value="initial">First email</option>
              <option value="morning_call">Morning call hook (strategic)</option>
              <option value="followup_1">Follow-up (day 3)</option>
              <option value="followup_2">Follow-up (day 7)</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={loading !== null || !businessName.trim() || !email.trim()}
            onClick={() => run("draft")}
            className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
          >
            {loading === "draft" ? "Writing…" : "1. Generate draft"}
          </button>
          <button
            type="button"
            disabled={loading !== null || !businessName.trim() || !email.trim()}
            onClick={() => run("preview")}
            className="btn-ghost border border-slate-200 px-4 py-2 text-sm disabled:opacity-50"
          >
            {loading === "preview" ? "Sending…" : "2. Send preview to me"}
          </button>
          <button
            type="button"
            disabled={loading !== null || !businessName.trim() || !email.trim()}
            onClick={() => run("send")}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading === "send" ? "Sending…" : "3. Send to lead"}
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
        {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
      </div>

      {(subject || body) && (
        <div className="surface-card p-6">
          <h2 className="font-semibold text-ghost-white">Email preview</h2>
          <label className="mt-4 block text-sm">
            <span className="font-medium text-ghost-white">Subject</span>
            <input
              className="input-field mt-1 w-full"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </label>
          <label className="mt-4 block text-sm">
            <span className="font-medium text-ghost-white">Body</span>
            <textarea
              className="input-field mt-1 min-h-48 w-full font-mono text-xs leading-relaxed"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </label>
          <p className="mt-2 text-xs text-on-surface-variant">
            Edits here are for your reference — regenerate or send uses the AI draft from the API. Copy/paste
            manually if you heavily edit.
          </p>
        </div>
      )}
    </div>
  );
}
