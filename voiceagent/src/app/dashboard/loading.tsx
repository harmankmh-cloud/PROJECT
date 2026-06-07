export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-8">
      <div className="h-12 w-72 rounded-xl bg-cream-dark" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-24 rounded-2xl bg-cream-dark" />
        <div className="h-24 rounded-2xl bg-cream-dark" />
        <div className="h-24 rounded-2xl bg-cream-dark" />
        <div className="h-24 rounded-2xl bg-cream-dark" />
      </div>
      <div className="h-64 rounded-2xl bg-cream-dark" />
    </div>
  );
}
