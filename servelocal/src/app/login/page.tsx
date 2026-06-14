import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginFormNew } from "@/components/auth/LoginFormNew";
import { authErrorMessage } from "@/lib/auth-login-messages";
import { resolveUserRole } from "@/lib/auth-routing";
import { pageMetadata } from "@/lib/seo";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Sign In",
    description: "Sign in to your ServeLocal account.",
    path: "/login",
  }),
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; as?: string }>;
}) {
  const params = await searchParams;
  const authError = authErrorMessage(params.error);
  const asRole = params.as === "pro" || params.as === "homeowner" ? params.as : undefined;

  if (isSupabaseConfigured()) {
    try {
      const user = await getServerAuthUser();
      if (user) {
        const role = await resolveUserRole(user);
        if (role) redirect("/auth/after-login");
        redirect("/auth/choose-role");
      }
    } catch {
      // Render login form
    }
  }

  const subtitle =
    asRole === "pro"
      ? "Contractor sign in — we send you to your pro dashboard."
      : asRole === "homeowner"
        ? "Homeowner sign in — we send you to your jobs dashboard."
        : "Sign in — we route you to the right dashboard automatically.";

  return (
    <AuthLayout title="Welcome back" subtitle={subtitle}>
      <LoginFormNew initialError={authError} asRole={asRole} />
      <p className="mt-6 text-center text-sm text-slate-500">
        <a href="/" className="hover:text-primary hover:underline">
          ← Back to ServeLocal
        </a>
      </p>
    </AuthLayout>
  );
}
