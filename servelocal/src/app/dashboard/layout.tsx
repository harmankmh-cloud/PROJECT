import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  if (!supabase) redirect("/login");

  const user = await getServerAuthUser();
  if (!user) redirect("/login");

  return <>{children}</>;
}
