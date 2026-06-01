"use client";

import { useEffect, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function SuggestionButton() {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 5) {
      setError("Please write at least a few words.");
      setFormState("error");
      return;
    }

    setFormState("submitting");
    setError("");

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          email: email.trim() || undefined,
          pageUrl: pageUrl || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not send suggestion");
      }

      setFormState("success");
      setMessage("");
      setEmail("");
    } catch (err) {
      setFormState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  function closeModal() {
    setOpen(false);
    setFormState("idle");
    setError("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="suggestion-fab"
        aria-label="Send a suggestion"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9.5 7.5h5M9.5 12h5M6 20l1.5-4.5h11L20 20H6Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 4.5h12a1.5 1.5 0 0 1 1.5 1.5V12a1.5 1.5 0 0 1-1.5 1.5H9.5L6 17V6A1.5 1.5 0 0 1 6 4.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
        Suggestion
      </button>

      {open && (
        <div className="modal-backdrop" onClick={closeModal} role="presentation">
          <div
            className="modal-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="suggestion-title"
          >
            {formState === "success" ? (
              <div className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-2xl text-teal-600">
                  ✓
                </span>
                <h2 id="suggestion-title" className="font-display mt-4 text-xl font-bold text-zinc-900">
                  Thanks for the feedback!
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  We read every suggestion. Your input helps shape {SERVE_LOCAL_NAME}.
                </p>
                <button type="button" onClick={closeModal} className="btn-gold mt-6 w-full py-3">
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="section-eyebrow">Help us improve</p>
                    <h2 id="suggestion-title" className="font-display mt-1 text-xl font-bold text-zinc-900">
                      Send a suggestion
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      Ideas for design, features, or anything that would make this better for you.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="suggestion-message" className="text-sm font-medium text-zinc-700">
                      Your suggestion
                    </label>
                    <textarea
                      id="suggestion-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="I'd love if the site had…"
                      className="input-field mt-1.5 resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="suggestion-email" className="text-sm font-medium text-zinc-700">
                      Email <span className="font-normal text-zinc-400">(optional)</span>
                    </label>
                    <input
                      id="suggestion-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="input-field mt-1.5"
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="btn-gold w-full py-3 disabled:opacity-60"
                  >
                    {formState === "submitting" ? "Sending…" : "Send suggestion"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const SERVE_LOCAL_NAME = "ServeLocal";
