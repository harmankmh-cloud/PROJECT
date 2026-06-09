"use client";

import { useState } from "react";
import { FadeUp } from "@/components/motion/FadeUp";

const SEED_QA = [
  {
    q: "Do you provide free estimates?",
    a: "Yes, I provide free on-site estimates for most jobs within my service area. For larger projects, I may schedule a brief consultation first.",
  },
  {
    q: "What areas do you serve?",
    a: "I primarily serve the Fraser Valley and surrounding communities. Contact me with your address and I'll confirm availability.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes — I'm fully licensed in BC and carry liability insurance. Credentials are verified on my ServeLocal profile.",
  },
] as const;

export function ProQASection({ proName }: { proName: string }) {
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setSubmitted(true);
  }

  return (
    <FadeUp>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">Q&amp;A</h2>
        <p className="mt-1 text-sm text-muted">Questions from homeowners, answered by {proName}</p>

        <ul className="mt-4 space-y-4">
          {SEED_QA.map((item) => (
            <li key={item.q} className="rounded-[14px] border border-border bg-surface p-4">
              <p className="font-semibold text-foreground">Q: {item.q}</p>
              <p className="mt-2 text-sm text-muted">A: {item.a}</p>
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
              <textarea
                id="ask-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                placeholder="e.g. Do you offer weekend appointments?"
                className="input-focus-glow mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted"
              />
              <button
                type="submit"
                className="mt-3 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-light"
              >
                Submit Question
              </button>
            </>
          )}
        </form>
      </section>
    </FadeUp>
  );
}
