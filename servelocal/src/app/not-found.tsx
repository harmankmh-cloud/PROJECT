import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { SERVE_LOCAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: `The page you requested could not be found on ${SERVE_LOCAL.name}.`,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <MarketingPageShell className="flex flex-col">
      <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <p className="font-label text-primary">404</p>
        <h1 className="font-display mt-3 text-4xl font-black text-foreground">Page not found</h1>
        <p className="mt-4 text-muted">That page doesn&apos;t exist. Try posting a job or browsing a city.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ShimmerButton href="/request">Post a job</ShimmerButton>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-amber-400/50"
          >
            Home
          </Link>
        </div>
      </div>
    </MarketingPageShell>
  );
}
