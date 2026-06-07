import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { SupportForm } from "@/components/SupportForm";
import { BRAND } from "@/lib/brand";

export default function HelpPage() {
  return (
    <main className="mesh-bg min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <BrandLogo href="/" />
        <header>
          <h1 className="font-display mt-6 text-3xl text-brand-900">Help & contact</h1>
          <p className="mt-2 text-sm text-slate-500">
            Questions about {BRAND.name}? Send us a message.
          </p>
        </header>
        <SupportForm />
        <p className="text-center text-sm text-slate-500">
          Have an account?{" "}
          <Link href="/login" className="link-accent">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
