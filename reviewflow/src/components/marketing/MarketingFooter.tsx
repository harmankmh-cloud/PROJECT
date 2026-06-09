import Link from "next/link";
import { MARKETING } from "@/content/copy";
import { BRAND } from "@/lib/brand";
import { FAQ_ITEMS } from "@/lib/marketing-content";

export function MarketingFooter() {
  return (
    <footer>
      <div className="bg-primary px-6 py-8 text-center text-white">
        <p className="font-display text-lg">{MARKETING.footer.strip}</p>
        <Link href="/signup" className="mt-4 inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary">
          Start Free Trial →
        </Link>
      </div>
      <div className="border-t border-border bg-white py-12">
        <div className="marketing-container grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg text-text">{BRAND.name}</p>
            <p className="mt-2 text-sm text-muted">{BRAND.tagline}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">Product</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/#features">Features</Link></li>
              <li><Link href="/#pricing">Pricing</Link></li>
              <li><Link href="/#how-it-works">How it works</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/help">Help</Link></li>
              <li><Link href="/terms">Terms</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">FAQ</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {FAQ_ITEMS.slice(0, 3).map((item) => (
                <li key={item.q}>{item.q}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="marketing-container mt-10 text-center text-sm text-muted">
          {MARKETING.footer.madeIn}
        </p>
      </div>
    </footer>
  );
}
