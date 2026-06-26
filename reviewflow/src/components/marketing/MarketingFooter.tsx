import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { MARKETING } from "@/content/copy";
import { BRAND } from "@/lib/brand";
import { FAQ_ITEMS } from "@/lib/marketing-content";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

export function MarketingFooter() {
  return (
    <footer>
      <div className="footer-cta-strip px-6 py-12 text-center text-white">
        <p className="font-display text-xl md:text-2xl">{MARKETING.footer.strip}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
          Start your free trial — setup takes about 5 minutes.
        </p>
        <ShimmerButton href="/signup" tone="light" className="mt-6">
          Start Free Trial
        </ShimmerButton>
      </div>
      <div className="border-t border-border/80 bg-white py-14">
        <div className="marketing-container grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg text-text">{BRAND.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{BRAND.tagline}</p>
            <div className="mt-4 space-y-2 text-sm text-muted">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Fraser Valley, BC
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                {BRAND.contact.email}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">Product</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>
                <Link href="/#features" className="transition hover:text-primary">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="transition hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="transition hover:text-primary">
                  How it works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">Company</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>
                <Link href="/help" className="transition hover:text-primary">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-primary">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition hover:text-primary">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">FAQ</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {FAQ_ITEMS.slice(0, 3).map((item) => (
                <li key={item.q}>
                  <Link href="/#faq" className="transition hover:text-primary">
                    {item.q}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="marketing-container mt-12 text-center text-sm text-muted">
          {MARKETING.footer.madeIn}
        </p>
      </div>
    </footer>
  );
}
