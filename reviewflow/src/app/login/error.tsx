"use client";

import Link from "next/link";

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mesh-bg flex min-h-screen items-center justify-center px-6">
      <div className="auth-card max-w-md p-6">
        <h1 className="font-display text-xl text-brand-950">Sign-in error</h1>
        <p className="mt-2 text-sm text-slate-600">
          Something went wrong loading the sign-in page. This is usually a temporary issue or a Supabase
          configuration problem.
        </p>
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">{error.message}</p>
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={reset} className="btn-gold px-4 py-2 text-sm">
            Try again
          </button>
          <Link href="/" className="btn-ghost px-4 py-2 text-sm">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
