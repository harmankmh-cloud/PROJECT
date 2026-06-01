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
    <main className="mesh-bg flex min-h-screen flex-col px-4 py-12">
      <div className="mx-auto w-full max-w-md flex-1 flex flex-col justify-center">
        <div className="mb-6 rounded-2xl border border-teal-200/70 bg-white/90 p-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-brand-950">Looking to hire a tradie or get listed?</p>
          <p className="mt-1 text-sm text-slate-600">You don&apos;t need an account. Browse and contact pros for free.</p>
          <Link href="/" className="btn-gold mt-4 inline-flex px-6 py-2.5 text-sm">
            Continue without login
          </Link>
        </div>

        <div className="auth-card">
          <p className="page-eyebrow">{SERVE_LOCAL.name} admin only</p>
          <h1 className="font-display mt-2 text-3xl tracking-tight text-brand-950">Admin sign in</h1>
          <p className="mt-2 text-sm text-slate-500">For approving listings, reviews, and site management.</p>
          <div className="mt-8">
            <AdminLoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
