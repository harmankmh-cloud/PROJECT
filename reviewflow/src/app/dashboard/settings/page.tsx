import { redirect } from "next/navigation";
import { BusinessSettingsForm } from "@/components/BusinessSettingsForm";
import { QrCard } from "@/components/QrCard";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function SettingsPage() {
  const { business } = await getDashboardData();

  if (!business) redirect("/dashboard");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const reviewUrl = `${appUrl}/r/${business.slug}`;

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        <BusinessSettingsForm business={business} />
        <QrCard url={reviewUrl} businessName={business.name} />
      </div>
    </main>
  );
}
