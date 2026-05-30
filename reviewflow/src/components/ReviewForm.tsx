"use client";

import { useEffect, useMemo, useState } from "react";
import type { Business, PromptTemplate, StarRating } from "@/lib/types";
import { QUICK_NOTE_CHIPS, STAR_OPTIONS, starsLabel } from "@/lib/defaults";
import { buildFallbackReviewOptions } from "@/lib/review-fallbacks";

type Props = {
  business: Business;
  prompts: PromptTemplate[];
};

type Step = "stars" | "notes" | "options";

export function ReviewForm({ business, prompts }: Props) {
  const [step, setStep] = useState<Step>("stars");
  const [stars, setStars] = useState<StarRating | null>(null);
  const [notes, setNotes] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const stepNumber = step === "stars" ? 1 : step === "notes" ? 2 : 3;

  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: business.id, eventType: "page_view" }),
    }).catch(() => undefined);
  }, [business.id]);

  const placeholder = useMemo(() => {
    if (!stars) return "Tell us about your visit…";
    const level = stars >= 4 ? "great" : stars === 3 ? "okay" : "bad";
    return prompts.find((p) => p.experience_level === level)?.placeholder || "A few words is enough…";
  }, [stars, prompts]);

  function pickStars(value: StarRating) {
    setStars(value);
    setOptions([]);
    setDraft("");
    setDone(false);
    setError("");
    setStep("notes");
  }

  function addChip(chip: string) {
    setNotes((current) => (current ? `${current}. ${chip}` : chip));
  }

  async function handleGenerate() {
    if (!stars || notes.trim().length < 3) {
      setError("Tap a star rating and write at least a few words.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          starRating: stars,
          customerNotes: notes,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not generate reviews");

      let nextOptions: string[] = Array.isArray(data.options)
        ? data.options.filter((item: unknown) => typeof item === "string" && item.trim().length > 5)
        : [];

      if (nextOptions.length < 3) {
        nextOptions = buildFallbackReviewOptions({
          businessName: business.name,
          starRating: stars,
          customerNotes: notes,
        });
      }

      setOptions(nextOptions);
      setSelectedIndex(0);
      setDraft(nextOptions[0] || "");
      setStep("options");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function track(eventType: "google_click" | "copy_review") {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: business.id, eventType }),
    }).catch(() => undefined);
  }

  async function saveToOwner(reviewText: string) {
    if (!stars) return;
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessId: business.id,
        starRating: stars,
        customerNotes: notes,
        aiDraft: reviewText,
      }),
    });
  }

  async function handlePostOnGoogle() {
    if (!draft.trim() || !stars) return;

    setSubmitting(true);
    setError("");

    try {
      await saveToOwner(draft);
      await navigator.clipboard.writeText(draft);
      await track("copy_review");

      if (business.google_review_url) {
        await track("google_click");
        window.open(business.google_review_url, "_blank", "noopener,noreferrer");
      }

      setDone(true);
    } catch {
      setError("Could not copy. Select the text and copy manually.");
    } finally {
      setSubmitting(false);
    }
  }

  function selectOption(index: number) {
    setSelectedIndex(index);
    setDraft(options[index] || "");
    setDone(false);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-[1.75rem] border border-[#e8e2d9] bg-white shadow-[0_20px_60px_rgba(12,18,34,0.12)]">
        <div className="bg-brand-950 px-6 py-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">
            Step {stepNumber} of 3
          </p>
          <h1 className="font-display mt-1 text-2xl">{business.name}</h1>
          <p className="mt-1 text-sm text-white/60">Rate your visit, pick a review, post on Google</p>
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
          {step === "stars" && (
            <div className="space-y-4">
              <p className="text-center text-sm font-medium text-brand-950">
                How many stars would you give?
              </p>
              <div className="space-y-2">
                {STAR_OPTIONS.map((option) => (
                  <button
                    key={option.stars}
                    type="button"
                    onClick={() => pickStars(option.stars)}
                    className="flex w-full items-center gap-4 rounded-xl border border-[#e8e2d9] bg-cream px-4 py-3 text-left transition hover:border-gold-500 hover:bg-amber-50 active:scale-[0.99]"
                  >
                    <span className="text-lg tracking-wider text-gold-500">
                      {starsLabel(option.stars)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-brand-950">{option.label}</span>
                      <span className="text-xs text-stone-500">{option.subtitle}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "notes" && stars && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setStep("stars")}
                className="text-sm font-medium text-stone-500 hover:text-brand-950"
              >
                ← Change stars ({stars}/5)
              </button>

              <div className="rounded-xl bg-amber-50 px-4 py-3 text-center text-lg tracking-wider text-gold-600">
                {starsLabel(stars)}
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                  Quick picks (tap to add)
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_NOTE_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => addChip(chip)}
                      className="rounded-full border border-[#e8e2d9] bg-white px-3 py-1 text-xs font-medium text-brand-950 hover:border-gold-500"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={placeholder}
                className="input-field min-h-28 resize-none"
                autoFocus
              />

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="btn-gold w-full py-3.5"
              >
                {loading ? "Writing 3 options…" : "Get 3 review options"}
              </button>
            </div>
          )}

          {step === "options" && stars && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setStep("notes")}
                className="text-sm font-medium text-stone-500 hover:text-brand-950"
              >
                ← Change my notes
              </button>

              <p className="text-sm font-medium text-brand-950">Pick the review you like best</p>

              <div className="space-y-2">
                {options.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectOption(index)}
                    className={`w-full rounded-xl border p-3 text-left text-sm leading-relaxed transition ${
                      selectedIndex === index
                        ? "border-gold-500 bg-amber-50 ring-2 ring-gold-500/30"
                        : "border-[#e8e2d9] bg-cream hover:border-gold-500/40"
                    }`}
                  >
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-stone-400">
                      Option {index + 1}
                    </span>
                    {option}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-950">Edit before posting</label>
                <textarea
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setDone(false);
                  }}
                  className="input-field mt-2 min-h-32 resize-y leading-relaxed"
                />
              </div>

              {error && <p className="text-sm text-rose-600">{error}</p>}

              {done ? (
                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <p className="font-semibold">Done! Review copied.</p>
                  {business.google_review_url ? (
                    <p className="mt-1">Paste it on Google — and the owner was notified too.</p>
                  ) : (
                    <p className="mt-1">Paste it on Google. The owner was notified on their dashboard.</p>
                  )}
                </div>
              ) : (
                <>
                  {!business.google_review_url && (
                    <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      Google link not set yet — your review is still saved for the owner. Copy and post
                      on Google manually if you know their page.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handlePostOnGoogle}
                    disabled={submitting || !draft.trim()}
                    className="btn-dark w-full py-3.5 disabled:opacity-60"
                  >
                    {submitting
                      ? "Saving…"
                      : business.google_review_url
                        ? "Copy, notify owner & open Google"
                        : "Copy review & notify owner"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
