import { redirect } from "next/navigation";
import { HomeownerShell } from "@/components/dashboard/HomeownerShell";
import { getHomeownerDashboardCounts } from "@/lib/data/bookings";
import { createClient } from "@/lib/supabase/server";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";
import { resolveUserRole } from "@/lib/auth-routing";

export default async function HomeownerDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const user = await getServerAuthUser();

  if (user) {
    const role = await resolveUserRole(user);
    if (role === "pro") redirect("/dashboard/pro");
  }

  const counts = user ? await getHomeownerDashboardCounts(user.id) : null;

  return (
    <HomeownerShell
      email={user?.email ?? ""}
      badges={{
        quotes: counts?.openQuotes,
        reviews: counts?.pendingReviews,
        messages: counts?.unreadMessages,
      }}
    >
      {children}
    </HomeownerShell>
  );
}
