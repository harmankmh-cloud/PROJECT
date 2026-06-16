import { redirect } from "next/navigation";
import { RespondPanel } from "@/components/dashboard/RespondPanel";
import { getDashboardData } from "@/lib/dashboard-data";
import { getRespondDashboardData } from "@/lib/reviews-dashboard";

export default async function DashboardRespondPage() {
  const { business } = await getDashboardData();
  if (!business) redirect("/dashboard");

  const { unansweredProfile, unansweredGoogle } = await getRespondDashboardData(business.id);

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <RespondPanel
        businessName={business.name}
        unansweredProfile={unansweredProfile}
        unansweredGoogle={unansweredGoogle}
      />
    </main>
  );
}
