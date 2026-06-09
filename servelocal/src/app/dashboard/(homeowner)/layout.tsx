import { HomeownerShell } from "@/components/dashboard/HomeownerShell";
import { createClient } from "@/lib/supabase/server";

export default async function HomeownerDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  return <HomeownerShell email={user?.email ?? ""}>{children}</HomeownerShell>;
}
