import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { SmtpSetupGuide } from "@/components/SmtpSetupGuide";
import { SERVE_LOCAL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function LoginPage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && isPlatformAdmin(user.email)) {
        redirect("/admin");
      }
    }
  }

  return (
    <main className="mesh-bg min-h-screen px-4 py-12">
      <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
        <div className="auth-card h-fit">
          <p className="page-eyebrow">{SERVE_LOCAL.name} admin</p>
          <h1 className="font-display mt-2 text-3xl tracking-tight text-brand-950">Admin sign in</h1>
          <p className="mt-2 text-sm text-slate-500">
            Site owners only. Customers and tradies use the site without logging in.
          </p>
          {!isSupabaseConfigured() && (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Add Supabase keys to <code className="text-xs">.env.local</code> (see template) to enable admin
              login.
            </p>
          )}
          <div className="mt-8">
            <AdminLoginForm />
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            <Link href="/" className="font-semibold text-teal-600 hover:underline">
              ← Back to site (no login needed)
            </Link>
          </p>
        </div>
        <SmtpSetupGuide />
      </div>
    </main>
  );
}
