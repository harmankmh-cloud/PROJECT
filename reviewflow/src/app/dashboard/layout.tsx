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
    .select("name, slug, plan")
    .eq("user_id", user.id)
    .maybeSingle();

  const planLabel =
    business?.plan === "active" ? "Pro" : business?.plan === "trial" ? "Free Trial" : "Free";

  return (
    <>
      <DatadogInit />
      <DashboardShell
        businessName={business?.name}
        reviewSlug={business?.slug}
        planLabel={planLabel}
        isPlatformAdmin={isPlatformAdmin(user.email)}
      >
        {children}
      </DashboardShell>
    </>
  );
}
