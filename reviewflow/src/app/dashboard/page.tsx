import { SetupBusinessForm } from "@/components/Forms";
import { ControlCenterHub } from "@/components/ControlCenterHub";
import { ConversionFunnel } from "@/components/ConversionFunnel";
import { SetupChecklist } from "@/components/SetupChecklist";
import { QuickStartGuide } from "@/components/QuickStartGuide";
import { UsageMeter } from "@/components/UsageMeter";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function DashboardPage() {
  const { business, feedbackTotal, stats, usage } = await getDashboardData();

  if (!business) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <SetupBusinessForm />
      </main>
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const reviewUrl = `${appUrl}/r/${business.slug}`;

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
            Your dashboard
          </p>
          <h1 className="font-display mt-1 text-3xl text-brand-950 sm:text-4xl">{business.name}</h1>
          <p className="mt-2 text-sm text-stone-500">
            Reviews, QR poster, and your plan — simple and ready to use.
          </p>
        </header>

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
  );
}
