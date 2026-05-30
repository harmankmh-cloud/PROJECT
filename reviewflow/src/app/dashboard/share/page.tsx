import { redirect } from "next/navigation";
import { QrCard } from "@/components/QrCard";
import { ShareKit } from "@/components/ShareKit";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function SharePage() {
  const { business } = await getDashboardData();

  if (!business) redirect("/dashboard");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const reviewUrl = `${appUrl}/r/${business.slug}`;

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Your dashboard</p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">QR & sharing</h1>
          <p className="mt-2 text-sm text-stone-500">
            Print your poster and copy messages to send customers.
          </p>
        </header>
        <section className="grid gap-6 lg:grid-cols-2">
          <QrCard url={reviewUrl} businessName={business.name} />
          <ShareKit businessName={business.name} reviewUrl={reviewUrl} />
        </section>
      </div>
    </main>
  );
}
