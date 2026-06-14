import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginFormNew } from "@/components/auth/LoginFormNew";
import { authErrorMessage } from "@/lib/auth-login-messages";
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
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const authError = authErrorMessage(params.error);

  if (isSupabaseConfigured()) {
    try {
      const user = await getServerAuthUser();
      if (user) redirect("/auth/after-login");
    } catch {
      // Render login form
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in — we route you to the right dashboard automatically.">
      <LoginFormNew initialError={authError} />
      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/" className="hover:text-primary hover:underline">
          ← Back to ServeLocal
        </Link>
      </p>
    </AuthLayout>
  );
}
