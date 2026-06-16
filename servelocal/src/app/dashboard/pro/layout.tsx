import { redirect } from "next/navigation";
import { ProShell } from "@/components/dashboard/ProShell";
import { getProvidersForUser } from "@/lib/data";
import { getUserMessageThreads } from "@/lib/features-data";
import { createClient } from "@/lib/supabase/server";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";
import { resolveUserRole } from "@/lib/auth-routing";

export default async function ProDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const user = await getServerAuthUser();

  if (user) {
    const role = await resolveUserRole(user);
    if (role === "homeowner") redirect("/dashboard/jobs");
  }

  const listings = user ? await getProvidersForUser(user.id) : [];
  const threads = user ? await getUserMessageThreads(user.id, true) : [];

  return (
    <ProShell businessName={listings[0]?.display_name} notificationCount={threads.length}>
      {children}
    </ProShell>
  );
}
