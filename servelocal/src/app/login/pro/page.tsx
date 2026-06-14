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
    title: "Pro Sign In",
    description: "Sign in to your ServeLocal contractor account.",
    path: "/login/pro",
  }),
  robots: { index: false, follow: false },
};

export default async function ProLoginPage({
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
        if (user) redirect("/auth/after-login?intent=pro");
      }
    } catch {
      // Render login form
    }
  }

  return (
    <AuthLayout title="Pro sign in" subtitle="Manage leads, your listing, and homeowner messages.">
      <LoginFormNew initialError={authErrorMessage(params.error)} intent="pro" />
      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/login/homeowner" className="text-primary hover:underline">
          Sign in as a homeowner instead
        </Link>
        {" · "}
        <Link href="/login" className="hover:underline">
          Back
        </Link>
      </p>
    </AuthLayout>
  );
}
