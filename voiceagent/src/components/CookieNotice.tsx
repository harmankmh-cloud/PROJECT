"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "greetq-cookie-notice";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      if (cancelled) return;
      try {
        if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
      } catch {
        setVisible(true);
      }
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-glass-border-subtle bg-surface-container/95 px-5 py-4 backdrop-blur-xl"
    >
      <div className="marketing-container flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-on-surface-variant">
          We use essential cookies for sign-in and analytics to improve the product. See our{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <button
          type="button"
          className="btn-primary shrink-0 rounded-full px-5 py-2 text-xs"
          onClick={() => {
            try {
              localStorage.setItem(STORAGE_KEY, "1");
            } catch {
              /* ignore */
            }
            setVisible(false);
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
