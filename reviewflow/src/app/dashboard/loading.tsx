export default function DashboardLoading() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl animate-pulse space-y-8">
        <div className="h-12 w-72 rounded-xl bg-cream-dark" />
        <div className="h-40 rounded-2xl bg-cream-dark" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 rounded-2xl bg-cream-dark" />
          <div className="h-96 rounded-2xl bg-cream-dark" />
        </div>
      </div>
    </main>
  );
}
