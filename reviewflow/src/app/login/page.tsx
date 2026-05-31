import Link from "next/link";
import { AuthForm } from "@/components/Forms";
import { BrandLogo } from "@/components/BrandLogo";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const message = params.message ? decodeURIComponent(params.message) : "";

  return (
    <main className="mesh-bg flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-brand-950 p-12 lg:flex">
        <BrandLogo href="/" light />
        <ul className="space-y-4 text-white/80">
          {[
            "1–5 star customer flow on any phone",
            "3 AI review drafts in seconds",
            "Every rating lands on your dashboard",
            "Print-ready QR poster + share kit",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-400">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-xs text-white/30">Sign in to your command center</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <BrandLogo href="/" />
          </div>
          <div className="surface-card p-8">
            <h1 className="font-display text-2xl text-brand-950">Welcome back</h1>
            <p className="mt-1 text-sm text-stone-500">Sign in once — your dashboard opens next</p>
            {message && (
              <p className="mt-4 rounded-xl bg-amber-50 px-3 py-3 text-sm text-amber-950">{message}</p>
            )}
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
