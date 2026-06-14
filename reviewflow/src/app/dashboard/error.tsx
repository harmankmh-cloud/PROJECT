"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="surface-card max-w-md p-6">
        <h1 className="font-display text-xl text-brand-950">Dashboard error</h1>
        <p className="mt-2 text-sm text-stone-600">
          Something went wrong loading your dashboard. This is usually a login or Supabase setup issue.
        </p>
        <p className="mt-4 rounded-xl bg-cream-dark p-3 text-xs text-stone-700">{error.message}</p>
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={reset} className="btn-gold px-4 py-2 text-sm">
            Try again
          </button>
          <a href="/login" className="btn-ghost px-4 py-2 text-sm">
            Go to login
          </a>
        </div>
      </div>
    </main>
  );
}
