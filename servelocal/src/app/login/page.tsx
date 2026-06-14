import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginFormNew } from "@/components/auth/LoginFormNew";
import { pageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Sign In",
    description: "Sign in to your ServeLocal account.",
    path: "/login",
  }),
  robots: { index: false, follow: false },
};

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  auth_failed: "Sign-in link expired or invalid. Please try again.",
  missing_code: "Sign-in link was incomplete. Please request a new one.",
  session_error: "We could not verify your session. Please sign in again.",
  not_configured: "Authentication is not configured on this environment.",
  unauthorized: "You do not have access to that area.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const authError = params.error ? AUTH_ERROR_MESSAGES[params.error] ?? "Sign-in failed. Please try again." : null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) redirect("/auth/after-login");
      }
    } catch {
      // Render login form — middleware protects dashboard if session exists
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage jobs or your pro listing.">
      <LoginFormNew initialError={authError} />
      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/" className="hover:text-primary hover:underline">
          ← Back to ServeLocal
        </Link>
      </p>
    </AuthLayout>
  );
}
