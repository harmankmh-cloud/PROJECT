import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="dashboard-container animate-pulse space-y-4 py-8">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-4 w-80" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function DashboardDetailSkeleton() {
  return (
    <div className="dashboard-container animate-pulse space-y-6 py-8">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-4 w-96" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}
