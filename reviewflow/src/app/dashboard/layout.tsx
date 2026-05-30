import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/DashboardNav";

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
    <div className="min-h-screen bg-zinc-50">
      <DashboardNav businessName={business?.name} reviewSlug={business?.slug} />
      {children}
    </div>
  );
}
