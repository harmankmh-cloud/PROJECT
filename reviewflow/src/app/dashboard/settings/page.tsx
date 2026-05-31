import { redirect } from "next/navigation";
import { GoogleSetupProvider } from "@/components/GoogleSetupModal";
import { BusinessSettingsForm } from "@/components/BusinessSettingsForm";
import { DeleteBusinessPanel } from "@/components/DeleteBusinessPanel";
import { QrCard } from "@/components/QrCard";
import { buildReviewUrl, getAppUrl } from "@/lib/app-url-server";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function SettingsPage() {
  const { business } = await getDashboardData();

  if (!business) redirect("/dashboard");

  const appUrl = await getAppUrl();
  const reviewUrl = buildReviewUrl(appUrl, business.slug);

  return (
    <GoogleSetupProvider
      hasGoogleLink={!!business.google_review_url}
      initialUrl={business.google_review_url || ""}
      autoPrompt={false}
    >
      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <header>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Settings</p>
            <h1 className="font-display mt-1 text-3xl text-brand-950">My business</h1>
            <p className="mt-2 text-sm text-stone-500">Update your name, industry, and Google review link.</p>
          </header>
          <div className="grid gap-8 lg:grid-cols-2">
            <BusinessSettingsForm business={business} />
            <QrCard url={reviewUrl} slug={business.slug} businessName={business.name} />
          </div>
          <DeleteBusinessPanel business={business} />
        </div>
      </main>
    </GoogleSetupProvider>
  );
}
