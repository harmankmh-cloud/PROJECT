"use client";

import { useEffect, useState } from "react";
import { FadeUp } from "@/components/motion/FadeUp";
import type { ProQA } from "@/lib/features-data";

export function ProQASection({ proName, providerId }: { proName: string; providerId: string }) {
  const [items, setItems] = useState<ProQA[]>([]);
  const [question, setQuestion] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/qa?providerId=${providerId}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items || []));
  }, [providerId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !name.trim()) return;
    setLoading(true);
    const res = await fetch("/api/qa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId, askerName: name, question }),
    });
    setLoading(false);
    if (res.ok) {
      setSubmitted(true);
      setQuestion("");
    }
  }

  const answered = items.filter((i) => i.answer);
  const pending = items.filter((i) => !i.answer);

  return (
    <FadeUp>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">Q&amp;A</h2>
        <p className="mt-1 text-sm text-muted">Questions from homeowners, answered by {proName}</p>

        <ul className="mt-4 space-y-4">
          {answered.map((item) => (
            <li key={item.id} className="rounded-[14px] border border-border bg-surface p-4">
              <p className="font-semibold text-foreground">Q: {item.question}</p>
              <p className="mt-2 text-sm text-muted">A: {item.answer}</p>
            </li>
          ))}
          {pending.slice(0, 2).map((item) => (
            <li key={item.id} className="rounded-[14px] border border-dashed border-border bg-surface/50 p-4">
              <p className="font-semibold text-foreground">Q: {item.question}</p>
              <p className="mt-2 text-xs text-muted">Awaiting response from pro</p>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="mt-6 rounded-[14px] border border-border bg-surface p-4">
          <label htmlFor="ask-question" className="text-sm font-semibold text-foreground">
            Ask a question
          </label>
          {submitted ? (
            <p className="mt-3 text-sm text-success">
              Thanks! Your question has been submitted and will appear once answered.
            </p>
          ) : (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="input-focus-glow mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
              <textarea
                id="ask-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                required
                placeholder="e.g. Do you offer weekend appointments?"
                className="input-focus-glow mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted"
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-3 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-light disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Question"}
              </button>
            </>
          )}
        </form>
      </section>
    </FadeUp>
  );
}
