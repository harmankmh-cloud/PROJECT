"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { validateGoogleReviewUrl } from "@/lib/google-review-url";
import { BRAND } from "@/lib/brand";

type GoogleSetupContextValue = {
  openGoogleSetup: () => void;
};

const GoogleSetupContext = createContext<GoogleSetupContextValue | null>(null);

export function useGoogleSetup() {
  const ctx = useContext(GoogleSetupContext);
  if (!ctx) {
    return { openGoogleSetup: () => undefined };
  }
  return ctx;
}

type ProviderProps = {
  hasGoogleLink: boolean;
  initialUrl?: string;
  autoPrompt?: boolean;
  children: React.ReactNode;
};

export function GoogleSetupProvider({
  hasGoogleLink,
  initialUrl = "",
  autoPrompt = true,
  children,
}: ProviderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [googleReviewUrl, setGoogleReviewUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const openGoogleSetup = useCallback(() => {
    setError("");
    setSaved(false);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (hasGoogleLink || !autoPrompt) return;
    try {
      if (sessionStorage.getItem("ratelocal_google_prompt_seen") === "1") return;
    } catch {
      return;
    }
    const timer = window.setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem("ratelocal_google_prompt_seen", "1");
      } catch {
        /* private mode */
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [hasGoogleLink, autoPrompt]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validated = validateGoogleReviewUrl(googleReviewUrl);
    if (!validated.ok) {
      setError(validated.error);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/business/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleReviewUrl: validated.value }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save Google link");

      setSaved(true);
      router.refresh();
      window.setTimeout(() => setOpen(false), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GoogleSetupContext.Provider value={{ openGoogleSetup }}>
      {children}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="google-setup-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-brand-950/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close"
          />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
            <div className="border-b border-slate-200/80 bg-gradient-to-r from-brand-950 to-brand-900 px-6 py-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">One quick step</p>
              <h2 id="google-setup-title" className="font-display mt-1 text-2xl">
                Add your Google review link
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Paste it here — customers will open Google after a good review on {BRAND.name}.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 p-6">
              <label className="block space-y-2 text-sm">
                <span className="font-semibold text-brand-950">Google &quot;Write a review&quot; link</span>
                <input
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  placeholder="https://g.page/r/your-business/review"
                  className="input-field text-base"
                  autoFocus
                />
              </label>

              <button
                type="button"
                onClick={() => setShowHelp((v) => !v)}
                className="text-sm font-semibold text-gold-600 hover:underline"
              >
                {showHelp ? "Hide help ↑" : "Where do I find this link? →"}
              </button>

              {showHelp && (
                <ol className="list-decimal space-y-2 rounded-xl bg-cream px-5 py-4 text-sm leading-relaxed text-stone-600">
                  <li>Open <strong>Google Maps</strong> on your phone or computer.</li>
                  <li>Search for <strong>your business name</strong>.</li>
                  <li>Tap <strong>Write a review</strong> (or the stars).</li>
                  <li>Tap the <strong>share</strong> icon or copy the link from the browser bar.</li>
                  <li>Paste that link in the box above — it usually starts with <code className="text-xs">g.page</code> or <code className="text-xs">google.com/maps</code>.</li>
                </ol>
              )}

              {error && <p className="text-sm text-rose-600">{error}</p>}
              {saved && (
                <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                  Saved! Your customers can now open Google after a good review.
                </p>
              )}

              <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                <button type="submit" disabled={loading || !googleReviewUrl.trim()} className="btn-gold flex-1 py-3 disabled:opacity-50">
                  {loading ? "Saving…" : "Save Google link"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="btn-ghost flex-1 py-3">
                  Skip for now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </GoogleSetupContext.Provider>
  );
}
