import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { getPlatformAdminData, getPlatformTotals } from "@/lib/admin-data";
import { PlatformAdminPanel } from "@/components/PlatformAdminPanel";

export default async function PlatformAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  if (!isPlatformAdmin(user.email)) {
    redirect("/dashboard");
  }

  const rows = await getPlatformAdminData();
  const totals = await getPlatformTotals(rows);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Platform</p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">All businesses</h1>
          <p className="mt-2 text-sm text-stone-500">
            Your master control centre — every account on ReviewFlow.
          </p>
        </header>
        <PlatformAdminPanel rows={rows} totals={totals} appUrl={appUrl} />
      </div>
    </main>
  );
}
