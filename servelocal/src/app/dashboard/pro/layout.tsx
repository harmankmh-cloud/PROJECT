import { ProShell } from "@/components/dashboard/ProShell";
import { getProvidersForUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function ProDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const listings = user ? await getProvidersForUser(user.id, user.email ?? undefined) : [];

  return (
    <ProShell businessName={listings[0]?.display_name}>{children}</ProShell>
  );
}
