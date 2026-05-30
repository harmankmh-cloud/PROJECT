"use client";

import { useEffect, useMemo, useState } from "react";
import type { Business, PromptTemplate, StarRating } from "@/lib/types";
import {
  STAR_OPTIONS,
  getPromptForStars,
  noteChipsForStars,
  starsLabel,
} from "@/lib/defaults";
import { buildFallbackReviewOptions } from "@/lib/review-fallbacks";
import { copyToClipboard } from "@/lib/copy";
import { useCustomerBack } from "@/components/useCustomerBack";

type Props = {
  business: Business;
  prompts: PromptTemplate[];
};

type Step = "stars" | "notes" | "options";

export function ReviewForm({ business, prompts }: Props) {
  const { goBack, isLoggedIn, backLabel: dashboardBackLabel } = useCustomerBack();
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
  const prompt = stars ? getPromptForStars(stars, prompts) : undefined;
  const chips = stars ? noteChipsForStars(stars) : [];
  const isLowRating = stars !== null && stars <= 2;

  const headerSubtitle = useMemo(() => {
    if (isLowRating) return "Tell the owner honestly — we'll help you write it clearly.";
    return "Rate your visit, pick a review, post on Google.";
  }, [isLowRating]);

  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: business.id, eventType: "page_view" }),
    }).catch(() => undefined);
  }, [business.id]);

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
      setError("Pick a star rating and write at least a few words.");
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

    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessId: business.id,
        starRating: stars,
        customerNotes: notes,
        aiDraft: reviewText,
        isPrivate: isLowRating,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Could not notify the business owner.");
    }
  }

  async function handleFinish() {
    if (!draft.trim() || !stars) return;

    setSubmitting(true);
    setError("");

    try {
      await saveToOwner(draft);
      await copyToClipboard(draft);
      await track("copy_review");

      if (business.google_review_url && !isLowRating) {
        await track("google_click");
        window.open(business.google_review_url, "_blank", "noopener,noreferrer");
      } else if (business.google_review_url && isLowRating) {
        // Low ratings: saved to owner first; Google is optional
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOpenGoogle() {
    if (!business.google_review_url) return;
    await track("google_click");
    window.open(business.google_review_url, "_blank", "noopener,noreferrer");
  }

  function selectOption(index: number) {
    setSelectedIndex(index);
    setDraft(options[index] || "");
    setDone(false);
  }

  function resetForm() {
    setStep("stars");
    setStars(null);
    setNotes("");
    setOptions([]);
    setDraft("");
    setDone(false);
    setError("");
    setSelectedIndex(0);
  }

  function goToPreviousStep() {
    if (done) {
      resetForm();
      return;
    }
    if (step === "options") {
      setStep("notes");
      return;
    }
    if (step === "notes") {
      setStep("stars");
      return;
    }
    goBack();
  }

  const backLabel =
    step === "stars"
      ? isLoggedIn
        ? "Dashboard"
        : "Back"
      : step === "notes"
        ? "Change stars"
        : done
          ? "Start over"
          : "Change notes";

  const generateLabel = prompt?.helper_label || "Get 3 review options";

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-[1.75rem] border border-[#e8e2d9] bg-white shadow-[0_20px_60px_rgba(12,18,34,0.12)]">
        <div className="bg-brand-950 px-6 py-5 text-white">
          <div className="mb-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              ← {backLabel}
            </button>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
              Step {stepNumber} of 3
            </span>
          </div>
          <h1 className="font-display text-2xl">{business.name}</h1>
          <p className="mt-1 text-sm text-white/60">{headerSubtitle}</p>
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
              <div className="rounded-xl bg-amber-50 px-4 py-3 text-center text-lg tracking-wider text-gold-600">
                {starsLabel(stars)}
              </div>

              {isLowRating && (
                <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-800">
                  The owner will see your feedback on their dashboard. You can still post on Google if
                  you choose.
                </p>
              )}

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                  Quick picks (tap to add)
                </p>
                <div className="flex flex-wrap gap-2">
                  {chips.map((chip) => (
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
                placeholder={prompt?.placeholder || "A few words is enough…"}
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
                {loading ? "Writing 3 options…" : generateLabel}
              </button>
            </div>
          )}

          {step === "options" && stars && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-brand-950">Pick the wording you like best</p>

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
                <label className="block text-sm font-medium text-brand-950">Edit before finishing</label>
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
                <div className="space-y-3">
                  <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    <p className="font-semibold">Done — owner notified & text copied.</p>
                    {!isLowRating && business.google_review_url && (
                      <p className="mt-1">Paste your review on Google in the tab that opened.</p>
                    )}
                    {isLowRating && (
                      <p className="mt-1">The business owner received your feedback on their dashboard.</p>
                    )}
                  </div>
                  {isLowRating && business.google_review_url && (
                    <button type="button" onClick={handleOpenGoogle} className="btn-ghost w-full py-3">
                      Still post on Google
                    </button>
                  )}
                  <button type="button" onClick={goBack} className="btn-dark w-full py-3">
                    ← {dashboardBackLabel}
                  </button>
                  <button type="button" onClick={resetForm} className="btn-ghost w-full py-3">
                    Leave another review
                  </button>
                </div>
              ) : (
                <>
                  {!business.google_review_url && (
                    <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      Google link not set yet — your feedback is still saved for the owner.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={submitting || !draft.trim()}
                    className="btn-dark w-full py-3.5 disabled:opacity-60"
                  >
                    {submitting
                      ? "Saving…"
                      : isLowRating
                        ? "Copy & notify owner"
                        : business.google_review_url
                          ? "Copy, notify owner & open Google"
                          : "Copy & notify owner"}
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
