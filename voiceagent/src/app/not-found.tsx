import Link from "next/link";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";

export default function NotFound() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 pb-20 pt-24 text-center">
        <p className="page-eyebrow">404</p>
        <h1 className="font-display mt-3 text-4xl text-ghost-white">Page not found</h1>
        <p className="mt-4 text-on-surface-variant">
          The page you are looking for does not exist or may have moved.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-primary px-6 py-3">
            Back to home
          </Link>
          <Link href="/help" className="btn-secondary px-6 py-3">
            Contact support
          </Link>
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
