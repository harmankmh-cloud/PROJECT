import { redirect } from "next/navigation";
import { GoogleDirectQrCard } from "@/components/GoogleDirectQrCard";
import { QrCard } from "@/components/QrCard";
import { ShareKit } from "@/components/ShareKit";
import { buildReviewUrl, getAppUrl } from "@/lib/app-url-server";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function SharePage() {
  const { business } = await getDashboardData();

  if (!business) redirect("/dashboard");

  const appUrl = await getAppUrl();
  const reviewUrl = buildReviewUrl(appUrl, business.slug);

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Your dashboard</p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">QR & sharing</h1>
          <p className="mt-2 text-sm text-stone-500">
            Smart QR (stars + AI drafts) or direct Google QR — print what fits your counter.
          </p>
        </header>
        <section className="grid gap-6 lg:grid-cols-2">
          <QrCard url={reviewUrl} businessName={business.name} />
          {business.google_review_url ? (
            <GoogleDirectQrCard
              googleReviewUrl={business.google_review_url}
              businessName={business.name}
            />
          ) : (
            <div className="surface-card flex flex-col justify-center p-8 text-sm text-stone-600">
              <p className="font-semibold text-brand-950">Want a direct Google QR?</p>
              <p className="mt-2 leading-relaxed">
                Add your Google review link in{" "}
                <a href="/dashboard/settings" className="font-semibold text-gold-600 hover:underline">
                  My business
                </a>{" "}
                — we&apos;ll generate a QR that opens Google instantly (like Google Business Profile).
              </p>
            </div>
          )}
        </section>
        <ShareKit businessName={business.name} reviewUrl={reviewUrl} />
      </div>
    </main>
  );
}
