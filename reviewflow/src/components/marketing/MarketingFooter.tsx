import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { MARKETING } from "@/content/copy";
import { BRAND } from "@/lib/brand";
import { FAQ_ITEMS } from "@/lib/marketing-content";
import { CITIES } from "@/data/cities";

export function MarketingFooter() {
  return (
    <footer className="relative border-t border-white/10">
      <div className="border-b border-white/10 px-6 py-14 text-center">
        <p className="font-grotesk text-2xl text-ink md:text-3xl">{MARKETING.footer.strip}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-soft">
          Start free — setup takes about 5 minutes.
        </p>
        <Link
          href="/signup"
          className="rl-btn-gold mt-6 inline-flex items-center justify-center px-7 py-3 text-sm"
        >
          Start Free →
        </Link>
      </div>

      <div className="py-14">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-grotesk text-lg text-ink">{BRAND.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-soft">{BRAND.tagline}</p>
            <div className="mt-4 space-y-2 text-sm text-muted-soft">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" />
                Fraser Valley, BC
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" />
                {BRAND.contact.email}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Product</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-soft">
              <li>
                <Link href="/#features" className="transition hover:text-gold">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition hover:text-gold">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="transition hover:text-gold">
                  How it works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">BC Cities</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-soft">
              {CITIES.map((city) => (
                <li key={city.slug}>
                  <Link href={`/reviews/${city.slug}`} className="transition hover:text-gold">
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Company</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-soft">
              <li>
                <Link href="/help" className="transition hover:text-gold">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-gold">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition hover:text-gold">
                  Privacy
                </Link>
              </li>
              {FAQ_ITEMS.slice(0, 2).map((item) => (
                <li key={item.q}>
                  <Link href="/help" className="transition hover:text-gold">
                    {item.q}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-6xl px-5 text-center text-sm text-muted-soft sm:px-8">
          {MARKETING.footer.madeIn}
        </p>
      </div>
    </footer>
  );
}
