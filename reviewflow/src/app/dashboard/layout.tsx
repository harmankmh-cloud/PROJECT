import { redirect } from "next/navigation";
import { DatadogInit } from "@/components/DatadogInit";
import { DashboardShell } from "@/components/DashboardShell";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

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
    <>
      <DatadogInit />
      <DashboardShell
        businessName={business?.name}
        reviewSlug={business?.slug}
        isPlatformAdmin={isPlatformAdmin(user.email)}
      >
        {children}
      </DashboardShell>
    </>
  );
}
