import { getPlatformAdminData, getPlatformTotals } from "@/lib/admin-data";
import { getAppUrl } from "@/lib/app-url-server";
import { PlatformAdminPanel } from "@/components/PlatformAdminPanel";

export default async function AdminOverviewPage() {
  const rows = await getPlatformAdminData();
  const totals = await getPlatformTotals(rows);
  const appUrl = await getAppUrl();

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
            Platform panel
          </p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">Overview</h1>
          <p className="mt-2 text-sm text-stone-500">
            Your full control centre — every business, plan, and review on ReviewFlow.
          </p>
        </header>
        <PlatformAdminPanel rows={rows} totals={totals} appUrl={appUrl} compact />
      </div>
    </main>
  );
}
