export default function DashboardLoading() {
  return (
    <div className="dashboard-container animate-pulse space-y-8 py-8">
      <div className="h-12 w-72 rounded-xl bg-surface-container-high" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-40 rounded-2xl bg-surface-container-high" />
        <div className="h-40 rounded-2xl bg-surface-container-high" />
      </div>
      <div className="h-64 rounded-2xl bg-surface-container-high" />
    </div>
  );
}
