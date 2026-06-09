"use client";

import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Share2, Check } from "lucide-react";
import type { PublicBusiness } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";
import { StarDisplay } from "@/components/ui/StarRating";

const STEPS = ["Rating", "Review", "Photos", "Details", "Publish"];

const ASPECTS = [
  { key: "quality", label: "Quality" },
  { key: "value", label: "Value" },
  { key: "service", label: "Service" },
  { key: "atmosphere", label: "Atmosphere" },
] as const;

export function WriteReviewFlow({ business }: { business: PublicBusiness }) {
  const [step, setStep] = useState(0);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [subRatings, setSubRatings] = useState<Record<string, number>>({});
  const [authorName, setAuthorName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  async function publish() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessSlug: business.slug,
          authorName: authorName || "Anonymous",
          starRating: rating,
          body,
          subRatings,
          isVerifiedVisit: true,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to publish");
      }
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function handlePhotoDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      setPhotos((p) => [...p, URL.createObjectURL(file)]);
    }
  }

  if (done) {
    return (
      <div className="marketing-container max-w-lg py-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
          <Check className="h-8 w-8 text-success" />
        </motion.div>
        <h1 className="font-display text-2xl font-bold text-text">Review published!</h1>
        <p className="mt-2 text-muted">Thanks for supporting {business.name}</p>
        <div className="card-glow mt-8 p-4 text-left">
          <StarDisplay value={rating} size="md" />
          <p className="mt-2 text-sm text-text">{body}</p>
        </div>
        <p className="mt-6 text-sm text-star">
          Earn your Reviewer Badge! You&apos;re 1 review away from &ldquo;Local Expert&rdquo; status
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" className="btn-ghost flex items-center gap-2 text-sm">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <Link href={`/business/${business.slug}`} className="btn-primary-pill px-6 py-2 text-sm">
            View business
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="marketing-container max-w-lg py-10">
      <Link href={`/business/${business.slug}`} className="text-sm text-muted hover:text-primary">
        ← {business.name}
      </Link>

      <div className="mt-4 flex gap-1">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mt-8"
        >
          {step === 0 && (
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold text-text">How was your visit?</h1>
              <p className="mt-2 text-muted">Tap to rate {business.name}</p>
              <div className="mt-8 flex justify-center">
                <StarRating value={rating} onChange={setRating} size="lg" />
              </div>
              <button
                type="button"
                disabled={rating === 0}
                onClick={next}
                className="btn-primary-pill mt-10 px-10 py-3 disabled:opacity-40"
              >
                Continue
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="font-display text-2xl font-bold text-text">Tell us about your experience</h1>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What stood out? Would you recommend this place?"
                className="input-field mt-4 min-h-[160px] resize-y"
                maxLength={2000}
              />
              <p className="mt-1 text-right text-xs text-muted">{body.length}/2000</p>
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name (optional)"
                className="input-field mt-4"
              />
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={back} className="btn-ghost flex-1 py-3">Back</button>
                <button type="button" disabled={body.length < 10} onClick={next} className="btn-primary-pill flex-1 py-3 disabled:opacity-40">Continue</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="font-display text-2xl font-bold text-text">Add photos</h1>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handlePhotoDrop}
                className="mt-4 flex min-h-[160px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface p-6 text-center"
              >
                <p className="text-muted">Drag & drop photos here</p>
                <p className="mt-1 text-xs text-muted">Optional — preview appears below</p>
              </div>
              {photos.length > 0 && (
                <div className="mt-4 flex gap-2">
                  {photos.map((url) => (
                    <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg">
                      <Image src={url} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={back} className="btn-ghost flex-1 py-3">Back</button>
                <button type="button" onClick={next} className="btn-primary-pill flex-1 py-3">Continue</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="font-display text-2xl font-bold text-text">Rate specific aspects</h1>
              <div className="mt-6 space-y-6">
                {ASPECTS.map(({ key, label }) => (
                  <div key={key}>
                    <p className="mb-2 text-sm font-medium text-text">{label}</p>
                    <StarRating
                      value={subRatings[key] ?? 0}
                      onChange={(v) => setSubRatings((s) => ({ ...s, [key]: v }))}
                      size="md"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={back} className="btn-ghost flex-1 py-3">Back</button>
                <button type="button" onClick={next} className="btn-primary-pill flex-1 py-3">Preview</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h1 className="font-display text-2xl font-bold text-text">Confirm & Publish</h1>
              <div className="card-glow mt-6 p-5">
                <div className="flex items-center gap-3">
                  {business.logo_url && (
                    <Image src={business.logo_url} alt="" width={40} height={40} className="rounded-lg" />
                  )}
                  <div>
                    <p className="font-semibold text-text">{business.name}</p>
                    <StarDisplay value={rating} size="sm" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-text">{body}</p>
                <p className="mt-2 text-xs text-muted">— {authorName || "Anonymous"}</p>
              </div>
              {error && <p className="mt-3 text-sm text-danger">{error}</p>}
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={back} className="btn-ghost flex-1 py-3">Back</button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={publish}
                  className="btn-primary-pill flex-1 py-3 disabled:opacity-40"
                >
                  {submitting ? "Publishing…" : "Publish Review"}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
