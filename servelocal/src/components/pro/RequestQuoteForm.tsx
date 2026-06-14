"use client";

import { useState } from "react";
import Link from "next/link";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { formatSubmitError } from "@/lib/form-utils";

type Props = {
  providerId: string;
  providerSlug: string;
  providerName: string;
};

export function RequestQuoteForm({ providerId, providerSlug, providerName }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await fetch(`/api/contact/${providerSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId }),
      });

      const requestUrl = `/request?pro=${providerSlug}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&desc=${encodeURIComponent(description)}&date=${encodeURIComponent(preferredDate)}`;
      window.location.href = requestUrl;
    } catch (err) {
      setError(formatSubmitError(err instanceof Error ? err.message : "Could not submit"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      id="request-quote"
      className="sticky top-24 rounded-[14px] border border-border bg-surface p-6 shadow-lg"
    >
      <h3 className="font-display text-lg font-bold text-foreground">Request a Quote</h3>
      <p className="mt-1 text-sm text-muted">Get a free estimate from {providerName}</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="quote-name" className="text-xs font-medium text-muted">
            Your name
          </label>
          <input
            id="quote-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-focus-glow mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground"
          />
        </div>
        <div>
          <label htmlFor="quote-email" className="text-xs font-medium text-muted">
            Email
          </label>
          <input
            id="quote-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-focus-glow mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground"
          />
        </div>
        <div>
          <label htmlFor="quote-desc" className="text-xs font-medium text-muted">
            Project description
          </label>
          <textarea
            id="quote-desc"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you need done..."
            className="input-focus-glow mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted"
          />
        </div>
        <div>
          <label htmlFor="quote-date" className="text-xs font-medium text-muted">
            Preferred date
          </label>
          <input
            id="quote-date"
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="input-focus-glow mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <ShimmerButton type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Get Free Quote"}
        </ShimmerButton>
      </form>

      <p className="mt-4 text-center text-xs text-muted">
        Or{" "}
        <Link href={`/request?pro=${providerSlug}`} className="text-primary hover:underline">
          post a job to multiple pros
        </Link>
      </p>
    </div>
  );
}
