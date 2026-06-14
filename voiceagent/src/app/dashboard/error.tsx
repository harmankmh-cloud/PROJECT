"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="surface-card p-8 text-center">
      <h2 className="text-lg font-semibold text-ghost-white">Something went wrong</h2>
      <p className="mt-2 text-sm text-on-surface-variant">{error.message || "An unexpected error occurred."}</p>
      <button type="button" onClick={reset} className="btn-primary mt-6">
        Try again
      </button>
    </div>
  );
}
