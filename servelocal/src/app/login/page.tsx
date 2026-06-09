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

export default async function LoginPage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) redirect("/auth/after-login");
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage jobs or your pro listing.">
      <LoginFormNew />
      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/" className="hover:text-primary hover:underline">
          ← Back to ServeLocal
        </Link>
      </p>
    </AuthLayout>
  );
}
