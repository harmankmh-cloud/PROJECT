export default function DashboardLoading() {
  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-6xl animate-pulse space-y-8">
        <div className="h-10 w-64 rounded-2xl bg-zinc-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-28 rounded-3xl bg-zinc-200" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 rounded-3xl bg-zinc-200" />
          <div className="h-80 rounded-3xl bg-zinc-200" />
        </div>
      </div>
    </main>
  );
}
