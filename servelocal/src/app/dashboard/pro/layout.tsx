import { redirect } from "next/navigation";
import { ProShell } from "@/components/dashboard/ProShell";
import { getProvidersForUser } from "@/lib/data";
import { getUserMessageThreads } from "@/lib/features-data";
import { createClient } from "@/lib/supabase/server";
import { resolveUserRole } from "@/lib/auth-routing";

export default async function ProDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (user) {
    const role = await resolveUserRole(user);
    if (role === "homeowner") redirect("/dashboard/jobs");
  }

  const listings = user ? await getProvidersForUser(user.id, user.email ?? undefined) : [];
  const threads = user ? await getUserMessageThreads(user.id, true) : [];

  return (
    <ProShell businessName={listings[0]?.display_name} notificationCount={threads.length}>
      {children}
    </ProShell>
  );
}
