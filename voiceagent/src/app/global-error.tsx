"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text">
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
            <h2 className="text-lg font-semibold">Application error</h2>
            <p className="mt-2 text-sm text-muted">
              {error.message || "A critical error occurred."}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
            >
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
