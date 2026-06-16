import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ChooseRoleForm } from "@/components/auth/ChooseRoleForm";
import { resolveUserRole } from "@/lib/auth-routing";
import { pageMetadata } from "@/lib/seo";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = pageMetadata({
  title: "Choose Account Type",
  description: "Tell ServeLocal whether you are a homeowner or a contractor.",
  path: "/auth/choose-role",
});

export default async function ChooseRolePage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const user = await getServerAuthUser();
  if (!user) redirect("/login");

  const role = await resolveUserRole(user);
  if (role) redirect(`/auth/after-login?as=${role}`);

  return (
    <AuthLayout
      title="One quick step"
      subtitle="We need to know how you use ServeLocal so we send you to the right dashboard."
    >
      <ChooseRoleForm />
    </AuthLayout>
  );
}
