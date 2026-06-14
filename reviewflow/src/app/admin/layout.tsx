import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  if (!isPlatformAdmin(user.email)) {
    redirect("/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}
