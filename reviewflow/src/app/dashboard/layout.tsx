import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { DashboardShell } from "@/components/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("name, slug")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <DashboardShell
      businessName={business?.name}
      reviewSlug={business?.slug}
      showPlatformAdmin={isPlatformAdmin(user.email)}
    >
      {children}
    </DashboardShell>
  );
}
