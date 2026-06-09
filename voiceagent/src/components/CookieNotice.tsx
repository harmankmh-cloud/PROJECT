"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "greetq-cookie-consent";

type Consent = "all" | "essential" | null;

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      if (cancelled) return;
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as Consent;
        if (stored === "all" || stored === "essential") {
          /* consent already recorded */
        } else {
          setVisible(true);
        }
      } catch {
        setVisible(true);
      }
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, []);

  function save(value: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, value ?? "essential");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-glass-border-subtle bg-surface-container/95 px-5 py-4 backdrop-blur-xl"
    >
      <div className="marketing-container flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-on-surface-variant">
          We use essential cookies for sign-in. With your consent, we also use analytics to improve
          the product. See our{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-border px-4 py-2 text-xs text-muted transition hover:text-text"
            onClick={() => save("essential")}
          >
            Reject non-essential
          </button>
          <button
            type="button"
            className="btn-primary shrink-0 rounded-full px-5 py-2 text-xs"
            onClick={() => save("all")}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}

/** Returns true when analytics cookies/scripts may load. */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "all";
  } catch {
    return false;
  }
}
