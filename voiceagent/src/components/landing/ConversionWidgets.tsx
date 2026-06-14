"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, PhoneCall, X } from "lucide-react";
import { useEffect, useState } from "react";

const EXIT_KEY = "greetq-exit-intent-shown";

async function captureLead(email: string, source: string, businessName?: string) {
  const res = await fetch("/api/leads/capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source, business_name: businessName || undefined }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Something went wrong");
  }
}

function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;
    if (sessionStorage.getItem(EXIT_KEY)) return;

    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 8) return;
      if (sessionStorage.getItem(EXIT_KEY)) return;
      sessionStorage.setItem(EXIT_KEY, "1");
      setOpen(true);
    };
    const timer = setTimeout(() => document.addEventListener("mouseout", onLeave), 8000);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      await captureLead(email, "exit-intent");
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Before you go"
            className="relative w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 text-muted transition hover:text-text"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>

            {state === "done" ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
                <h3 className="font-display mt-4 text-xl text-text">You&apos;re all set</h3>
                <p className="mt-2 text-sm text-muted">
                  Read the buyer&apos;s guide now — or we&apos;ll follow up by email.
                </p>
                <Link
                  href="/resources/buyers-guide"
                  className="mt-4 inline-block rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
                  onClick={() => setOpen(false)}
                >
                  Open buyer&apos;s guide →
                </Link>
              </div>
            ) : (
              <>
                <p className="section-eyebrow mb-2">Before you go</p>
                <h3 className="font-display text-2xl text-text">
                  Not ready yet? Take the buyer&apos;s guide.
                </h3>
                <p className="mt-2 text-sm text-muted">
                  How to evaluate AI receptionists — questions to ask, pricing traps to avoid, and a
                  Canadian compliance checklist.
                </p>
                <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
                  <input
                    type="email"
                    required
                    placeholder="you@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-muted focus:border-violet-500/60 focus:outline-none"
                    aria-label="Email address"
                  />
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
                  >
                    {state === "loading" ? "Sending…" : "Send me the guide"}
                  </button>
                  {state === "error" ? <p className="text-xs text-rose-400">{error}</p> : null}
                </form>
                <p className="mt-3 text-xs text-muted">No spam. Unsubscribe anytime.</p>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function CallbackButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const note = [phone ? `Callback: ${phone}` : null, preferredTime ? `Preferred: ${preferredTime}` : null]
        .filter(Boolean)
        .join(" · ");
      await captureLead(email, "callback-request", note || undefined);
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="fixed bottom-20 left-5 z-[50]">
      <AnimatePresence>
        {open ? (
          <motion.div
            className="mb-3 w-72 rounded-xl border border-border bg-surface p-5 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            {state === "done" ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
                <p className="mt-3 text-sm text-text">We&apos;ll call you back within one business day.</p>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-text">Request a callback</p>
                <p className="mt-1 text-xs text-muted">A human from {`GreetQ`} — not a bot. Promise.</p>
                <form onSubmit={submit} className="mt-3 flex flex-col gap-2.5">
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted focus:border-violet-500/60 focus:outline-none"
                    aria-label="Email address"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted focus:border-violet-500/60 focus:outline-none"
                    aria-label="Phone number"
                  />
                  <input
                    type="text"
                    placeholder="Preferred time (e.g. Tue 2–4pm PT)"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted focus:border-violet-500/60 focus:outline-none"
                    aria-label="Preferred callback time"
                  />
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
                  >
                    {state === "loading" ? "Sending…" : "Call me back"}
                  </button>
                  {state === "error" ? <p className="text-xs text-rose-400">{error}</p> : null}
                </form>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-violet-500/30 bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition hover:border-violet-500/60"
      >
        {open ? <X className="h-4 w-4" /> : <PhoneCall className="h-4 w-4 text-violet-400" />}
        {open ? "Close" : "Request callback"}
      </button>
    </div>
  );
}

/** Mounted in the marketing footer so every public page gets both widgets. */
export function ConversionWidgets() {
  return (
    <>
      <ExitIntentModal />
      <CallbackButton />
    </>
  );
}
