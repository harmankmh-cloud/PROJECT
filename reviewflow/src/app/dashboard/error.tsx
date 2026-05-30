"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">Dashboard error</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Something went wrong loading your dashboard. This is usually a login or Supabase setup issue.
        </p>
        <p className="mt-4 rounded-2xl bg-zinc-50 p-3 text-xs text-zinc-700">{error.message}</p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
          <a href="/login" className="rounded-2xl border border-zinc-300 px-4 py-2 text-sm text-zinc-800">
            Go to login
          </a>
        </div>
      </div>
    </main>
  );
}
