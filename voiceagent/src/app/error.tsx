"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="surface-card max-w-md p-8 text-center">
        <h2 className="text-lg font-semibold text-ghost-white">Something went wrong</h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          {error.message || "An unexpected error occurred."}
        </p>
        <button type="button" onClick={reset} className="btn-primary mt-6">
          Try again
        </button>
      </div>
    </div>
  );
}
