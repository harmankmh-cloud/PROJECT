import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { DashboardShell } from "@/components/DashboardShell";
import { PageTransition } from "@/components/ui/PageTransition";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const org = await getUserOrg(user.id);

  return (
    <DashboardShell
      orgName={org?.name}
      userEmail={user.email}
      isPlatformAdmin={isPlatformAdmin(user.email)}
    >
      <PageTransition>{children}</PageTransition>
    </DashboardShell>
  );
}
