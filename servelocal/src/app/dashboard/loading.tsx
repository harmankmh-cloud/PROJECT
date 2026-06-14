export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl animate-pulse px-4 py-8 md:px-8">
        <div className="h-8 w-48 rounded-lg bg-surface" />
        <div className="mt-2 h-4 w-72 rounded bg-surface" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="h-28 rounded-[14px] bg-surface" />
          <div className="h-28 rounded-[14px] bg-surface" />
          <div className="h-28 rounded-[14px] bg-surface" />
        </div>
        <div className="mt-8 h-64 rounded-[14px] bg-surface" />
      </div>
    </div>
  );
}
