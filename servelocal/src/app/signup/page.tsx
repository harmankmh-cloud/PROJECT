import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { SERVE_LOCAL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function SignupPage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) redirect("/dashboard");
    }
  }

  return (
    <main className="mesh-bg flex min-h-screen items-center justify-center px-4 py-12">
      <div className="auth-card w-full max-w-md">
        <p className="page-eyebrow">{SERVE_LOCAL.name}</p>
        <h1 className="font-display mt-2 text-3xl tracking-tight text-brand-950">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Homeowners: track job requests and quotes. Tradies: manage your listing after you apply.
        </p>
        <div className="mt-8">
          <AuthForm mode="signup" />
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-teal-600 hover:underline">
            Sign in
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-slate-500">
          <Link href="/" className="hover:text-teal-600 hover:underline">
            ← Back to {SERVE_LOCAL.name}
          </Link>
        </p>
      </div>
    </main>
  );
}
