import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SERVE_LOCAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: `The page you requested could not be found on ${SERVE_LOCAL.name}.`,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="mesh-bg flex min-h-screen flex-col">
      <SiteHeader compact />
      <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <p className="page-eyebrow">404</p>
        <h1 className="font-display mt-3 text-4xl text-brand-950">Page not found</h1>
        <p className="mt-4 text-slate-600">That page doesn&apos;t exist. Try posting a job or browsing a city.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/request" className="btn-gold px-6 py-3">
            Post a job
          </Link>
          <Link href="/" className="btn-ghost px-6 py-3">
            Home
          </Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
