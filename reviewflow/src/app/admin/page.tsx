import { AdminQuickActions } from "@/components/AdminQuickActions";
import { AdminStatsGrid } from "@/components/AdminStatsGrid";
import { getPlatformAdminData, getPlatformExtendedTotals } from "@/lib/admin-data";
import { getAppUrl } from "@/lib/app-url-server";
import { BRAND } from "@/lib/brand";

export default async function AdminOverviewPage() {
  const rows = await getPlatformAdminData();
  const [totals, appUrl] = await Promise.all([
    getPlatformExtendedTotals(rows),
    getAppUrl(),
  ]);

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
            Platform panel
          </p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">Overview</h1>
          <p className="mt-2 text-sm text-stone-500">
            Your full control centre — every business, plan, and review on {BRAND.name}.
          </p>
        </header>
        <AdminStatsGrid totals={totals} />
        <AdminQuickActions appUrl={appUrl} />
      </div>
    </main>
  );
}
