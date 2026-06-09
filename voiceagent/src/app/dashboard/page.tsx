import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { PageTransition } from "@/components/ui/PageTransition";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const org = user ? await getUserOrg(user.id) : null;

  return (
    <PageTransition>
      <DashboardOverview orgName={org?.name} />
    </PageTransition>
  );
}
