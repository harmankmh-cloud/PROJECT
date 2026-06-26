import { GoogleSetupProvider } from "@/components/GoogleSetupModal";
import { GoogleLinkDashboardBanner } from "@/components/dashboard/GoogleLinkDashboardBanner";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { SetupBusinessForm } from "@/components/Forms";
import { PageTransition } from "@/components/ui/PageTransition";
import { buildReviewUrl, getAppUrl } from "@/lib/app-url-server";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function DashboardPage() {
  const { business, feedback, feedbackTotal, stats, usage, reviewsThisWeek } = await getDashboardData();

  if (!business) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <SetupBusinessForm />
      </main>
    );
  }

  const appUrl = await getAppUrl();
  const reviewUrl = buildReviewUrl(appUrl, business.slug);

  return (
    <GoogleSetupProvider
      hasGoogleLink={!!business.google_review_url}
      initialUrl={business.google_review_url || ""}
    >
      <PageTransition>
        <main className="dashboard-container flex-1">
          <div className="mx-auto flex max-w-6xl flex-col gap-6">
            {!business.google_review_url && <GoogleLinkDashboardBanner />}
            <DashboardOverview
              business={business}
              stats={stats}
              feedback={feedback}
              feedbackTotal={feedbackTotal}
              usage={usage}
              reviewUrl={reviewUrl}
              reviewsThisWeek={reviewsThisWeek ?? 0}
            />
          </div>
        </main>
      </PageTransition>
    </GoogleSetupProvider>
  );
}
