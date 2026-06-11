import { GeistMono } from "geist/font/mono";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { PwaRegister } from "@/components/PwaRegister";
import { TrialStatusBanner } from "@/components/dashboard/TrialStatusBanner";
import { UsageMeterBanner } from "@/components/dashboard/UsageMeterBanner";
import { DashboardProviders } from "@/components/providers/AppProviders";
import { PageTransition } from "@/components/ui/PageTransition";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { getUserOrg } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const org = await getUserOrg(user.id);

  return (
    <div className={GeistMono.variable}>
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
