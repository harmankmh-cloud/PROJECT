import Link from "next/link";
import { LANDING } from "@/content/copy";
import { BRAND } from "@/lib/brand";

export function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="marketing-container py-12">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center md:p-12">
          <h2 className="font-display text-2xl text-text md:text-3xl">Own a local business?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">{LANDING.footer.forBusiness}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary-pill px-8 py-3">
              Claim Your Listing — Free
            </Link>
            <Link href="/pricing" className="btn-ghost px-8 py-3">
              View Pricing
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
          <div>
            <p className="font-display text-lg font-bold text-text">{BRAND.name}</p>
            <p className="text-sm text-muted">{LANDING.footer.tagline}</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted">
            <Link href="/discover" className="hover:text-text">
              Discover
            </Link>
            <Link href="/pricing" className="hover:text-text">
              Pricing
            </Link>
            <Link href="/help" className="hover:text-text">
              Help
            </Link>
            <Link href="/privacy" className="hover:text-text">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-text">
              Terms
            </Link>
          </nav>
          <p className="text-sm text-muted">{LANDING.footer.madeIn}</p>
        </div>
      </div>
    </footer>
  );
}
