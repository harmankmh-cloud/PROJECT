import Link from "next/link";
import { AuthForm } from "@/components/Forms";
import { BrandLogo } from "@/components/BrandLogo";

export default function SignupPage() {
  return (
    <main className="mesh-bg flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-brand-950 p-12 lg:flex">
        <BrandLogo href="/" light />
        <ul className="space-y-4 text-white/80">
          {[
            "Print-ready QR poster in minutes",
            "AI drafts that sound human",
            "Private channel for unhappy customers",
            "Share kit: SMS, email, counter sign",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-400">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-xs text-white/30">No credit card required to start</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <BrandLogo href="/" />
          </div>
          <div className="surface-card p-8">
            <h1 className="font-display text-2xl text-brand-950">Create your account</h1>
            <p className="mt-1 text-sm text-stone-500">Launch your review page in 2 minutes</p>
            <div className="mt-6">
              <AuthForm mode="signup" />
            </div>
            <p className="mt-6 text-center text-sm text-stone-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-gold-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
