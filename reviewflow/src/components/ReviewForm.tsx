"use client";

import { useEffect, useMemo, useState } from "react";
import type { Business, ExperienceLevel, PromptTemplate } from "@/lib/types";
import { EXPERIENCE_OPTIONS } from "@/lib/defaults";

type Props = {
  business: Business;
  prompts: PromptTemplate[];
};

type Step = "experience" | "notes" | "draft";

export function ReviewForm({ business, prompts }: Props) {
  const [step, setStep] = useState<Step>("experience");
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [notes, setNotes] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const prompt = useMemo(
    () => prompts.find((item) => item.experience_level === experience),
    [prompts, experience]
  );

  const selectedOption = EXPERIENCE_OPTIONS.find((o) => o.level === experience);
  const isPrivate = experience === "bad";

  const stepNumber = step === "experience" ? 1 : step === "notes" ? 2 : 3;

  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: business.id, eventType: "page_view" }),
    }).catch(() => undefined);
  }, [business.id]);

  function pickExperience(level: ExperienceLevel) {
    setExperience(level);
    setDraft("");
    setSaved(false);
    setError("");
    setStep("notes");
  }

  async function handleGenerate() {
    if (!experience || notes.trim().length < 3) {
      setError("Write at least a few words about your visit.");
      return;
    }

    setLoading(true);
    setError("");
    setSaved(false);

    try {
      const response = await fetch("/api/ai/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          experienceLevel: experience,
          customerNotes: notes,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not generate text");

      setDraft(data.draft);
      setStep("draft");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function track(eventType: "google_click" | "copy_review" | "private_feedback") {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: business.id, eventType }),
    }).catch(() => undefined);
  }

  async function handleCopy() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      await track(isPrivate ? "private_feedback" : "copy_review");
      setSaved(true);
    } catch {
      setError("Could not copy — please select the text and copy manually.");
    }
  }

  async function handleSavePrivate() {
    if (!experience || !draft) return;
    setError("");
    setSaved(false);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          experienceLevel: experience,
          customerNotes: notes,
          aiDraft: draft,
          isPrivate: true,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save feedback");

      await track("private_feedback");
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save feedback");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-[1.75rem] border border-[#e8e2d9] bg-white shadow-[0_20px_60px_rgba(12,18,34,0.12)]">
        <div className="bg-brand-950 px-6 py-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">
            Step {stepNumber} of 3
          </p>
          <h1 className="font-display mt-1 text-2xl">{business.name}</h1>
          <div className="mt-4 flex gap-1">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded-full ${n <= stepNumber ? "bg-gold-500" : "bg-white/20"}`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {step === "experience" && (
            <div className="space-y-4">
              <p className="text-center text-sm font-medium text-brand-950">
                How was your experience today?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {EXPERIENCE_OPTIONS.map((option) => (
                  <button
                    key={option.level}
                    type="button"
                    onClick={() => pickExperience(option.level)}
                    className="rounded-2xl border border-[#e8e2d9] bg-cream p-4 text-left transition hover:border-gold-500/50 hover:shadow-md active:scale-[0.98]"
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <p className="mt-2 text-sm font-semibold text-brand-950">{option.label}</p>
                    <p className="mt-0.5 text-xs text-stone-500">{option.subtitle}</p>
                  </button>
                ))}
              </div>
              <p className="rounded-xl bg-cream-dark px-3 py-2 text-center text-xs text-stone-500">
                Not great? Your feedback stays private — no Google push.
              </p>
            </div>
          )}

          {step === "notes" && selectedOption && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setStep("experience")}
                className="text-sm font-medium text-stone-500 hover:text-brand-950"
              >
                ← Change rating
              </button>

              <div className={`rounded-xl border px-4 py-3 ${selectedOption.color.split(" ").slice(1).join(" ")} border-current/20`}>
                <span className="text-xl">{selectedOption.emoji}</span>
                <span className="ml-2 text-sm font-semibold text-brand-950">{selectedOption.label}</span>
              </div>

              <label className="block text-sm font-medium text-brand-950">
                {isPrivate ? "What went wrong?" : "Tell us about your visit"}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={prompt?.placeholder || "A few words is enough…"}
                className="input-field min-h-32 resize-none"
                autoFocus
              />

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="btn-gold w-full py-3.5"
              >
                {loading ? "Writing your draft…" : prompt?.helper_label || "Create my draft"}
              </button>
            </div>
          )}

          {step === "draft" && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setStep("notes")}
                className="text-sm font-medium text-stone-500 hover:text-brand-950"
              >
                ← Edit my notes
              </button>

              <div>
                <label className="block text-sm font-medium text-brand-950">
                  {isPrivate ? "Your private message" : "Your review draft"}
                </label>
                <p className="mt-0.5 text-xs text-stone-500">Edit anything — make it sound like you.</p>
                <textarea
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setSaved(false);
                  }}
                  className="input-field mt-2 min-h-36 resize-y leading-relaxed"
                />
              </div>

              {error && <p className="text-sm text-rose-600">{error}</p>}

              {saved && (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                  {isPrivate ? "Sent privately. Thank you for the honest feedback." : "Copied! Paste it on Google when you're ready."}
                </p>
              )}

              <div className="space-y-2">
                <button type="button" onClick={handleCopy} className="btn-ghost w-full py-3">
                  Copy {isPrivate ? "message" : "review"}
                </button>

                {isPrivate ? (
                  <>
                    <button type="button" onClick={handleSavePrivate} className="btn-dark w-full py-3">
                      Send to {business.name}
                    </button>
                    {business.google_review_url && (
                      <a
                        href={business.google_review_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => track("google_click")}
                        className="block py-2 text-center text-sm text-stone-500 underline"
                      >
                        Still want to post on Google?
                      </a>
                    )}
                  </>
                ) : (
                  business.google_review_url && (
                    <a
                      href={business.google_review_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => track("google_click")}
                      className="btn-dark flex w-full items-center justify-center py-3"
                    >
                      Copy done — open Google review
                    </a>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
