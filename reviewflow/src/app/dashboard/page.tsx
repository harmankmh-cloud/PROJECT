import Link from "next/link";
import { SetupBusinessForm } from "@/components/Forms";
import { QrCard } from "@/components/QrCard";
import { ConversionFunnel } from "@/components/ConversionFunnel";
import { SetupChecklist } from "@/components/SetupChecklist";
import { ShareKit } from "@/components/ShareKit";
import { QuickStartGuide } from "@/components/QuickStartGuide";
import { FeedbackInbox } from "@/components/FeedbackInbox";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function DashboardPage() {
  const { business, feedback, stats } = await getDashboardData();

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
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
              Command center
            </p>
            <h1 className="font-display mt-1 text-3xl text-brand-950 sm:text-4xl">{business.name}</h1>
            <p className="mt-2 text-sm text-stone-500">{business.business_type}</p>
          </div>
          <Link
            href={`/r/${business.slug}`}
            target="_blank"
            rel="noreferrer"
            className="btn-dark px-5 py-2.5"
          >
            View live page ↗
          </Link>
        </header>

        <SetupChecklist
          businessName={business.name}
          reviewUrl={reviewUrl}
          hasGoogleLink={!!business.google_review_url}
          hasFeedback={feedback.length > 0}
        />

        <QuickStartGuide reviewUrl={reviewUrl} hasGoogleLink={!!business.google_review_url} />

        {stats && <ConversionFunnel stats={stats} />}

        <section className="grid gap-6 lg:grid-cols-2">
          <QrCard url={reviewUrl} businessName={business.name} />
          <ShareKit businessName={business.name} reviewUrl={reviewUrl} />
        </section>

        <FeedbackInbox feedback={feedback} />
      </div>
    </main>
  );
}
