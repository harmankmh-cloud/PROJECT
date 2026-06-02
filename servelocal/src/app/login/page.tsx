import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { SERVE_LOCAL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        redirect(isPlatformAdmin(user.email) ? "/admin" : "/dashboard");
      }
    }
  }

  const unauthorized = params.error === "unauthorized";

  return (
    <main className="mesh-bg min-h-screen px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="auth-card h-fit">
          <p className="page-eyebrow">{SERVE_LOCAL.name}</p>
          <h1 className="font-display mt-2 text-3xl tracking-tight text-brand-950">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500">
            Homeowners and tradies — track jobs and manage your account. Site owners with admin access go to the
            admin panel after sign-in.
          </p>
          {unauthorized && (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              That account does not have admin access. Use your dashboard instead.
            </p>
          )}
          {!isSupabaseConfigured() && (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Add Supabase keys to <code className="text-xs">.env.local</code> (see template) to enable login.
            </p>
          )}
          <div className="mt-8">
            <AuthForm mode="login" />
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            New here?{" "}
            <Link href="/signup" className="font-semibold text-teal-600 hover:underline">
              Create an account
            </Link>
          </p>
          <p className="mt-4 text-center text-xs text-slate-400">
            <Link href="/help/email" className="hover:text-teal-600 hover:underline">
              Site owner: email setup (Resend)
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-slate-500">
            <Link href="/" className="hover:text-teal-600 hover:underline">
              ← Back to {SERVE_LOCAL.name}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
