import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { PageTransition } from "@/components/ui/PageTransition";
import { getUserOrg } from "@/lib/auth";
import { getOrgSetupStatus } from "@/lib/org-setup-status";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const org = user ? await getUserOrg(user.id) : null;
  const setup = org ? await getOrgSetupStatus(org.id) : null;

  return (
    <PageTransition>
      <DashboardOverview orgName={org?.name} setup={setup ?? undefined} />
    </PageTransition>
  );
}
