"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ClientOnly } from "@/components/ui/ClientOnly";
import { StarRating as StarRatingInput } from "@/components/ui/StarRating";
import { PUBLIC_REVIEW } from "@/content/copy";
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
      <div className="review-shell">
        <div className="border-b border-border bg-white px-6 py-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted hover:bg-surface"
            >
              ← {backLabel}
            </button>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Step {stepNumber} of 3
            </span>
          </div>
          <h1 className="font-display text-2xl text-text">{business.name}</h1>
          <p className="mt-1 text-sm text-muted">{headerSubtitle}</p>
          <div className="mt-4 flex gap-1">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded-full ${n <= stepNumber ? "bg-primary" : "bg-border"}`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {step === "stars" && (
            <div className="space-y-6">
              <p className="text-center text-lg font-semibold text-text">
                {PUBLIC_REVIEW.question(business.name)}
              </p>
              <div className="flex justify-center">
                <StarRatingInput
                  size="lg"
                  value={stars ?? 0}
                  onChange={(v) => pickStars(v as StarRating)}
                />
              </div>
              <div className="space-y-2">
                {STAR_OPTIONS.map((option) => (
                  <button
                    key={option.stars}
                    type="button"
                    onClick={() => pickStars(option.stars)}
                    className="star-option w-full"
                  >
                    <span className="text-lg tracking-wider text-accent">
                      {starsLabel(option.stars)}
                    </span>
                    <span className="text-sm text-muted">{option.label}</span>
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
                <p className="alert-danger">
                  1–2 star feedback stays private on the owner&apos;s dashboard (by design). Google is
                  not opened automatically — the customer can still choose to post on Google afterward.
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
                      className="chip-tag py-1"
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
                    className={`option-card ${
                      selectedIndex === index ? "option-card-selected" : ""
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
                <div className="space-y-3 text-center">
                  <ClientOnly
                    fallback={
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-bg">
                        <Check className="h-8 w-8 text-primary" />
                      </div>
                    }
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-bg"
                    >
                      <Check className="h-8 w-8 text-primary" />
                    </motion.div>
                  </ClientOnly>
                  <p className="font-display text-xl text-text">{PUBLIC_REVIEW.thanks}</p>
                  <div className="alert-success text-left">
                    <p className="font-semibold">Owner notified & text copied.</p>
                    {!isLowRating && business.google_review_url && (
                      <p className="mt-1">Paste your review on Google in the tab that opened.</p>
                    )}
                    {isLowRating && (
                      <p className="mt-1">Saved privately for the owner — use the button below if you still want Google.</p>
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
                    <p className="alert-warning text-xs">
                      Google link not set yet — your feedback is still saved for the owner.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={submitting || !draft.trim()}
                    className="btn-gold w-full py-3.5 disabled:opacity-60"
                  >
                    {submitting
                      ? "Saving…"
                      : isLowRating
                        ? "Save private feedback & copy text"
                        : business.google_review_url
                          ? PUBLIC_REVIEW.openGoogle
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
