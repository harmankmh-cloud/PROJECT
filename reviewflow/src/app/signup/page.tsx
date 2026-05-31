import Link from "next/link";
import { AuthMarketingPanel } from "@/components/AuthMarketingPanel";
import { SignupWithBusinessForm } from "@/components/SignupWithBusinessForm";
import { BrandLogo } from "@/components/BrandLogo";

export default function SignupPage() {
  return (
    <main className="mesh-bg flex min-h-screen">
      <AuthMarketingPanel footer="No credit card required to start" />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 lg:hidden">
            <BrandLogo href="/" />
          </div>
          <div className="glass-panel p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint-500">Get started</p>
            <h1 className="font-display mt-2 text-3xl tracking-tight text-brand-950">Create your account</h1>
            <p className="mt-2 text-sm text-slate-500">
              One sleek form — account + business. Straight to your dashboard.
            </p>
            <div className="mt-8">
              <SignupWithBusinessForm />
            </div>
            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="link-accent">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
