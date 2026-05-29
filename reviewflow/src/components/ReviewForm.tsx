"use client";

import { useEffect, useMemo, useState } from "react";
import type { Business, ExperienceLevel, PromptTemplate } from "@/lib/types";
import { EXPERIENCE_OPTIONS } from "@/lib/defaults";

type Props = {
  business: Business;
  prompts: PromptTemplate[];
};

export function ReviewForm({ business, prompts }: Props) {
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

  const isPrivate = experience === "bad";

  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: business.id, eventType: "page_view" }),
    }).catch(() => undefined);
  }, [business.id]);

  async function handleGenerate() {
    if (!experience || notes.trim().length < 3) {
      setError("Please choose an experience and write at least a few words.");
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
      if (!response.ok) {
        throw new Error(data.error || "Could not generate text");
      }

      setDraft(data.draft);
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
    await navigator.clipboard.writeText(draft);
    await track(isPrivate ? "private_feedback" : "copy_review");
    setSaved(true);
  }

  async function handleSavePrivate() {
    if (!experience || !draft) return;

    await fetch("/api/feedback", {
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

    await track("private_feedback");
    setSaved(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-emerald-700">ReviewFlow</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-900">{business.name}</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Share honest feedback about your experience. You can edit anything before posting.
        </p>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-zinc-800">How was your experience?</p>
        <div className="grid grid-cols-2 gap-3">
          {EXPERIENCE_OPTIONS.map((option) => (
            <button
              key={option.level}
              type="button"
              onClick={() => {
                setExperience(option.level);
                setDraft("");
                setSaved(false);
                setError("");
              }}
              className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                experience === option.level
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {experience && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-zinc-800">
            {isPrivate
              ? "Tell us what went wrong so the business can improve"
              : "What did you like or notice?"}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={prompt?.placeholder || "Write a few words about your visit"}
            className="min-h-28 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none ring-emerald-500 focus:ring-2"
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Working..." : prompt?.helper_label || "Help me write it"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {draft && (
        <div className="space-y-4 rounded-2xl bg-zinc-50 p-4">
          <p className="text-sm font-medium text-zinc-800">
            {isPrivate ? "Private feedback draft" : "Review draft"}
          </p>
          <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700">{draft}</p>
          <p className="text-xs text-zinc-500">Edit this to match your real experience.</p>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-800"
            >
              Copy text
            </button>

            {isPrivate ? (
              <>
                <button
                  type="button"
                  onClick={handleSavePrivate}
                  className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white"
                >
                  Send private feedback to business
                </button>
                {business.google_review_url && (
                  <a
                    href={business.google_review_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track("google_click")}
                    className="text-center text-sm text-zinc-600 underline"
                  >
                    I still want to leave a public Google review
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
                  className="rounded-2xl bg-zinc-900 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Open Google review page
                </a>
              )
            )}
          </div>

          {saved && (
            <p className="text-sm font-medium text-emerald-700">
              {isPrivate ? "Private feedback saved. Thank you." : "Copied. You can paste it on Google."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
