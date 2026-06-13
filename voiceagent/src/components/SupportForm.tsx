"use client";

import { useState } from "react";
import { BRAND } from "@/lib/brand";

const categories = [
  { value: "help", label: "I need help" },
  { value: "suggestion", label: "Suggestion" },
  { value: "bug", label: "Something's broken" },
  { value: "billing", label: "Billing / plan" },
  { value: "other", label: "Other" },
] as const;

type Category = (typeof categories)[number]["value"];

type Props = {
  defaultEmail?: string;
  defaultOrgName?: string;
  defaultCategory?: Category;
  defaultMessage?: string;
  compact?: boolean;
};

export function SupportForm({
  defaultEmail = "",
  defaultOrgName = "",
  defaultCategory = "help",
  defaultMessage = "",
  compact,
}: Props) {
  const [email, setEmail] = useState(defaultEmail);
  const [orgName, setOrgName] = useState(defaultOrgName);
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [message, setMessage] = useState(defaultMessage);
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          orgName: orgName.trim() || undefined,
          category,
          message: message.trim(),
          website,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not send");
      setSent(true);
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="surface-card p-8 text-center">
        <p className="text-3xl">✓</p>
        <h3 className="font-display mt-3 text-xl text-ghost-white">Message sent</h3>
        <p className="mt-2 text-sm text-on-surface-variant">
          The {BRAND.name} team got your note. We usually reply within 1–2 business days.
        </p>
        <button type="button" onClick={() => setSent(false)} className="btn-ghost mt-6 px-4 py-2 text-sm">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-4" : "surface-card space-y-5 p-6 sm:p-8"}>
      {!compact && (
        <div>
          <h2 className="font-display text-xl text-ghost-white">Send us a message</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Questions, ideas, or issues — we read every one.</p>
        </div>
      )}

      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <label className="block space-y-2 text-sm">
        <span className="font-semibold text-ghost-white">Your email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
          placeholder="you@business.com"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-semibold text-ghost-white">Organization (optional)</span>
        <input
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          className="input-field"
          placeholder="Mike's Barber"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-semibold text-ghost-white">Topic</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as (typeof categories)[number]["value"])}
          className="input-field"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-semibold text-ghost-white">Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-field min-h-[140px] resize-y"
          required
          minLength={10}
          placeholder="Tell us what you need — the more detail, the faster we can help."
        />
      </label>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
