import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: `The page you requested could not be found on ${BRAND.name}.`,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="mesh-bg flex min-h-screen flex-col">
      <header className="site-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <BrandLogo />
          <Link href="/" className="btn-ghost px-4 py-2 text-sm">
            Home
          </Link>
        </div>
      </header>
      <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <p className="page-eyebrow">404</p>
        <h1 className="font-display mt-3 text-4xl text-brand-950">Page not found</h1>
        <p className="mt-4 text-slate-600">That link doesn&apos;t exist — try one of these instead.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-gold px-6 py-3">
            Back to home
          </Link>
          <Link href="/pricing" className="btn-ghost px-6 py-3">
            View pricing
          </Link>
          <Link href="/help" className="btn-ghost px-6 py-3">
            Help
          </Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
