import { redirect } from "next/navigation";
import { CallLocalPanel } from "@/components/CallLocalPanel";
import { buildReviewUrl, getAppUrl } from "@/lib/app-url-server";
import {
  ensureCallLocalSettingsRow,
  getRecentCallEvents,
  isCallLocalSubscribed,
} from "@/lib/calllocal-data";
import { getDashboardData } from "@/lib/dashboard-data";
import { isTwilioConfigured } from "@/lib/twilio";
import { CALLLOCAL_ADDON } from "@/lib/plans";

export default async function CallLocalPage() {
  const { business } = await getDashboardData();
  if (!business) redirect("/dashboard");

  const settings = await ensureCallLocalSettingsRow(business.id);
  const recentCalls = await getRecentCallEvents(business.id);
  const subscribed = await isCallLocalSubscribed(business.id);
  const appUrl = await getAppUrl();
  const reviewUrl = buildReviewUrl(appUrl, business.slug);

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <p className="page-eyebrow">CallLocal</p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">Missed calls → SMS</h1>
          <p className="mt-2 text-sm text-slate-600">
            Never lose a customer because you couldn&apos;t pick up the phone.
          </p>
        </header>
        <CallLocalPanel
          businessName={business.name}
          reviewUrl={reviewUrl}
          initialSettings={settings}
          recentCalls={recentCalls}
          twilioConfigured={isTwilioConfigured()}
          subscribed={subscribed}
          addonPriceUsd={CALLLOCAL_ADDON.monthlyUsd}
        />
      </div>
    </main>
  );
}
