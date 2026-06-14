"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export default function SentryExamplePage() {
  const [loading, setLoading] = useState(false);

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Sentry test page</h1>
        <p className="mt-2 text-sm text-muted">
          Trigger sample errors to verify your GreetQ Sentry project (
          <code className="text-xs">greetq/javascript</code>).
        </p>
      </div>

      <button
        type="button"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary disabled:opacity-50"
        disabled={loading}
        onClick={() => {
          setLoading(true);
          Sentry.startSpan({ name: "Example Frontend Span", op: "test" }, () => {
            throw new Error("Sentry Frontend Example Error");
          });
        }}
      >
        Throw frontend error
      </button>

      <button
        type="button"
        className="rounded-lg border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          try {
            const res = await fetch("/api/sentry-example-api");
            if (!res.ok) throw new Error("API error");
          } catch (err) {
            Sentry.captureException(err);
          } finally {
            setLoading(false);
          }
        }}
      >
        Throw API error
      </button>
    </main>
  );
}
