import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginFormNew } from "@/components/auth/LoginFormNew";
import { authErrorMessage } from "@/lib/auth-login-messages";
import { pageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Homeowner Sign In",
    description: "Sign in to your ServeLocal homeowner account.",
    path: "/login/homeowner",
  }),
  robots: { index: false, follow: false },
};

export default async function HomeownerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) redirect("/auth/after-login?intent=homeowner");
      }
    } catch {
      // Render login form
    }
  }

  return (
    <AuthLayout title="Homeowner sign in" subtitle="Access your jobs, quotes, and saved pros.">
      <LoginFormNew initialError={authErrorMessage(params.error)} intent="homeowner" />
      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/login/pro" className="text-primary hover:underline">
          Sign in as a pro instead
        </Link>
        {" · "}
        <Link href="/login" className="hover:underline">
          Back
        </Link>
      </p>
    </AuthLayout>
  );
}
