import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { PwaRegister } from "@/components/PwaRegister";
import { TrialStatusBanner } from "@/components/dashboard/TrialStatusBanner";
import { UsageMeterBanner } from "@/components/dashboard/UsageMeterBanner";
import { DashboardProviders } from "@/components/providers/AppProviders";
import { PageTransition } from "@/components/ui/PageTransition";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { getCachedUserOrg } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getCachedUserOrg();

  if (!ctx?.user) redirect("/login");

  const { user, org } = ctx;

  return (
   <div
     style={{
       "--font-geist-mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
     } as React.CSSProperties}
   >
     <DashboardProviders>
        <PwaRegister />
        <DashboardShell
          orgName={org?.name}
          userEmail={user.email}
          isPlatformAdmin={isPlatformAdmin(user.email)}
        >
          <TrialStatusBanner />
          <UsageMeterBanner />
          <PageTransition>{children}</PageTransition>
        </DashboardShell>
      </DashboardProviders>
    </div>
  );
}
