import Link from "next/link";
import { AuthForm } from "@/components/Forms";
import { AuthMarketingPanel } from "@/components/AuthMarketingPanel";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const message = params.message ? decodeURIComponent(params.message) : "";

  return (
    <main className="mesh-bg flex min-h-screen flex-col">
      <div className="flex flex-1">
        <AuthMarketingPanel footer="Sign in to your command center" />

        <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <BrandLogo href="/" />
          </div>
          <div className="auth-card">
            <p className="page-eyebrow">Welcome back</p>
            <h1 className="font-display mt-2 text-3xl tracking-tight text-brand-950">Sign in</h1>
            <p className="mt-2 text-sm text-slate-500">One step — your dashboard opens next.</p>
            {message && (
              <p className="alert-warning mt-4">
                {message}
              </p>
            )}
            <div className="mt-8">
              <AuthForm mode="login" />
            </div>
            <p className="mt-8 text-center text-sm text-slate-500">
              New here?{" "}
              <Link href="/signup" className="link-accent">
                Create free account
              </Link>
            </p>
            <p className="mt-3 text-center text-xs text-slate-400">
              <Link href="/help" className="hover:text-gold-600 hover:underline">
                Help & contact
              </Link>
            </p>
          </div>
        </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
