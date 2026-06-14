"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function FrWaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "fr-waitlist" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Une erreur est survenue");
      }
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  }

  if (state === "done") {
    return (
      <p className="mt-6 flex items-center justify-center gap-2 text-sm text-emerald-400">
        <CheckCircle2 className="h-5 w-5" />
        Merci! Vous serez parmi les premiers informés.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        placeholder="vous@entreprise.ca"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-muted focus:border-violet-500/60 focus:outline-none"
        aria-label="Adresse courriel"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
      >
        {state === "loading" ? "Envoi…" : "M'inscrire"}
      </button>
      {state === "error" ? <p className="text-xs text-rose-400">{error}</p> : null}
    </form>
  );
}
