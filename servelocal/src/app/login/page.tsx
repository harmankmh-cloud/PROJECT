import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { SERVE_LOCAL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { isPlatformAdmin } from "@/lib/admin-auth";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && isPlatformAdmin(user.email)) {
    redirect("/admin");
  }

  return (
    <main className="mesh-bg flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="auth-card">
          <p className="page-eyebrow">{SERVE_LOCAL.name} admin</p>
          <h1 className="font-display mt-2 text-3xl tracking-tight text-brand-950">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500">Approve listings and view customer requests.</p>
          <div className="mt-8">
            <AdminLoginForm />
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            <Link href="/" className="font-semibold text-teal-600 hover:underline">
              ← Back to site
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
