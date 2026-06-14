import { redirect } from "next/navigation";
import { DatadogInit } from "@/components/DatadogInit";
import { AdminShell } from "@/components/AdminShell";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  if (!isPlatformAdmin(user.email)) {
    redirect("/dashboard");
  }

  return (
    <>
      <DatadogInit />
      <AdminShell>{children}</AdminShell>
    </>
  );
}
