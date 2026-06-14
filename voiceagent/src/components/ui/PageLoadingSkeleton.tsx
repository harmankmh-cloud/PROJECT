export function PageLoadingSkeleton({ variant = "marketing" }: { variant?: "marketing" | "auth" | "demo" }) {
  if (variant === "auth") {
    return (
      <div className="flex min-h-screen animate-pulse">
        <div className="hidden w-[45%] bg-surface lg:block" />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-md space-y-4">
            <div className="mx-auto h-8 w-48 rounded-lg bg-surface" />
            <div className="h-12 rounded-lg bg-surface" />
            <div className="h-12 rounded-lg bg-surface" />
            <div className="h-10 rounded-lg bg-primary/30" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "demo") {
    return (
      <div className="min-h-screen animate-pulse bg-bg">
        <div className="h-14 border-b border-border bg-surface" />
        <div className="marketing-container space-y-6 py-8">
          <div className="h-8 w-64 rounded-lg bg-surface" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-surface" />
            ))}
          </div>
          <div className="h-64 rounded-xl bg-surface" />
        </div>
      </div>
    );
  }

  return (
    <div className="aurora-bg min-h-screen animate-pulse">
      <div className="h-16 border-b border-border/50" />
      <div className="marketing-container space-y-6 py-28 text-center">
        <div className="mx-auto h-6 w-64 rounded-full bg-surface" />
        <div className="mx-auto h-16 max-w-2xl rounded-xl bg-surface" />
        <div className="mx-auto h-6 max-w-xl rounded-lg bg-surface" />
        <div className="mx-auto flex h-12 w-72 gap-3">
          <div className="flex-1 rounded-lg bg-primary/30" />
          <div className="flex-1 rounded-lg bg-surface" />
        </div>
      </div>
    </div>
  );
}
