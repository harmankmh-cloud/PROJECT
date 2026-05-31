import { GoogleSetupProvider } from "@/components/GoogleSetupModal";
import { AdminHubBanner } from "@/components/AdminHubBanner";
import { SetupBusinessForm } from "@/components/Forms";
import { ControlCenterHub } from "@/components/ControlCenterHub";
import { ConversionFunnel } from "@/components/ConversionFunnel";
import { SetupChecklist } from "@/components/SetupChecklist";
import { QuickStartGuide } from "@/components/QuickStartGuide";
import { UsageMeter } from "@/components/UsageMeter";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { buildReviewUrl, getAppUrl } from "@/lib/app-url-server";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function DashboardPage() {
  const { user, business, feedbackTotal, stats, usage } = await getDashboardData();

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
      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <header className="dashboard-hero border-l-4 border-l-teal-500">
            <div className="hero-glow -right-8 -top-8 h-32 w-32 bg-teal-400/15" />
            <p className="page-eyebrow relative">Your dashboard</p>
            <h1 className="font-display relative mt-2 text-3xl text-brand-950 sm:text-5xl">
              {business.name}
            </h1>
            <p className="relative mt-2 max-w-xl text-base text-slate-600">
              Reviews, QR poster, and your plan — everything in one place.
            </p>
            <a
              href={reviewUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost relative mt-5 inline-flex text-sm"
            >
              Preview customer page ↗
            </a>
          </header>

          {isPlatformAdmin(user?.email) && <AdminHubBanner />}

          <SetupChecklist
            businessName={business.name}
            reviewUrl={reviewUrl}
            hasGoogleLink={!!business.google_review_url}
            hasFeedback={feedbackTotal > 0}
          />

          <ControlCenterHub
            business={business}
            stats={stats}
            usage={usage}
            feedbackTotal={feedbackTotal}
            reviewUrl={reviewUrl}
          />

          {usage && <UsageMeter usage={usage} />}

          {stats && <ConversionFunnel stats={stats} />}

          <QuickStartGuide reviewUrl={reviewUrl} hasGoogleLink={!!business.google_review_url} />
        </div>
      </main>
    </GoogleSetupProvider>
  );
}
