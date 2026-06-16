import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RolePicker } from "@/components/auth/RolePicker";
import { resolveUserRole } from "@/lib/auth-routing";
import { pageMetadata } from "@/lib/seo";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Create Your Account",
    description: "Join ServeLocal BC — homeowners post jobs free; contractors browse leads and contact clients direct.",
    path: "/signup",
  }),
  robots: { index: false, follow: false },
};

export default async function SignupPage() {
  if (isSupabaseConfigured()) {
    try {
      const user = await getServerAuthUser();
      if (user) {
        const role = await resolveUserRole(user);
        if (role) redirect(`/auth/after-login?as=${role}`);
        redirect("/auth/choose-role");
      }
    } catch {
      // Render signup form
    }
  }

  return (
    <AuthLayout
      title="Join ServeLocal"
      subtitle="Choose how you'll use the platform — homeowner or contractor."
    >
      <RolePicker />
    </AuthLayout>
  );
}
