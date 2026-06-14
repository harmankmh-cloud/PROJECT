export function PageLoadingSkeleton({ variant = "marketing" }: { variant?: "marketing" | "auth" | "dashboard" | "review" }) {
  if (variant === "auth") {
    return (
      <div className="flex min-h-screen animate-pulse items-center justify-center bg-surface p-8">
        <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-lg">
          <div className="mx-auto h-8 w-32 rounded-lg bg-surface" />
          <div className="h-12 rounded-xl bg-surface" />
          <div className="h-12 rounded-xl bg-surface" />
          <div className="h-10 rounded-full bg-primary/30" />
        </div>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="flex min-h-screen animate-pulse">
        <div className="hidden w-[220px] border-r border-border bg-white lg:block" />
        <div className="flex-1 space-y-6 p-8">
          <div className="h-8 w-64 rounded-xl bg-surface" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-surface" />
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-surface" />
        </div>
      </div>
    );
  }

  if (variant === "review") {
    return (
      <div className="mx-auto min-h-screen max-w-md animate-pulse p-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-surface" />
        <div className="mx-auto mt-4 h-6 w-48 rounded-lg bg-surface" />
        <div className="mt-8 flex justify-center gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 w-12 rounded-full bg-surface" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-pulse bg-white">
      <div className="h-16 border-b border-border" />
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-24">
        <div className="h-16 max-w-2xl rounded-xl bg-surface" />
        <div className="h-6 max-w-xl rounded-lg bg-surface" />
        <div className="flex gap-3">
          <div className="h-12 w-40 rounded-full bg-primary/30" />
          <div className="h-12 w-40 rounded-xl bg-surface" />
        </div>
      </div>
    </div>
  );
}
