import Link from "next/link";
import { AuthForm } from "@/components/Forms";
import { BrandLogo } from "@/components/BrandLogo";

export default function LoginPage() {
  return (
    <main className="mesh-bg flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-brand-950 p-12 lg:flex">
        <BrandLogo href="/" light />
        <div>
          <blockquote className="font-display text-3xl leading-snug text-white">
            &ldquo;We went from 12 Google reviews to 47 in two months — without awkward asks at
            checkout.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-white/50">— Local business owner, BC</p>
        </div>
        <p className="text-xs text-white/30">ReviewFlow customer preview</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <BrandLogo href="/" />
          </div>
          <div className="surface-card p-8">
            <h1 className="font-display text-2xl text-brand-950">Welcome back</h1>
            <p className="mt-1 text-sm text-stone-500">Sign in to your command center</p>
            <div className="mt-6">
              <AuthForm mode="login" />
            </div>
            <p className="mt-6 text-center text-sm text-stone-500">
              New here?{" "}
              <Link href="/signup" className="font-semibold text-gold-600 hover:underline">
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
