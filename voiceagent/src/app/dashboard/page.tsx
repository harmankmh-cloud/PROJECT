import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { PageTransition } from "@/components/ui/PageTransition";
import { getCachedUserOrg } from "@/lib/auth";
import { getOrgSetupStatus } from "@/lib/org-setup-status";

export default async function DashboardPage() {
  const ctx = await getCachedUserOrg();
  const org = ctx?.org ?? null;
  const setup = org ? await getOrgSetupStatus(org.id) : null;

  return (
    <PageTransition>
      <DashboardOverview orgName={org?.name} setup={setup ?? undefined} />
    </PageTransition>
  );
}
