import { redirect } from "next/navigation";
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";
import { getAnalyticsSnapshot } from "@/lib/analytics-dashboard";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function DashboardAnalyticsPage() {
  const { business } = await getDashboardData();
  if (!business) redirect("/dashboard");

  const analytics = await getAnalyticsSnapshot(business.id);

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <AnalyticsPanel data={analytics} />
    </main>
  );
}
