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
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Settings</p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">My business</h1>
          <p className="mt-2 text-sm text-stone-500">Update your name, industry, and Google review link.</p>
        </header>
        <div className="grid gap-8 lg:grid-cols-2">
          <BusinessSettingsForm business={business} />
          <QrCard url={reviewUrl} businessName={business.name} />
        </div>
      </div>
    </main>
  );
}
