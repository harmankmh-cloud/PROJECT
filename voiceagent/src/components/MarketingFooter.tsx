import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { BRAND } from "@/lib/brand";

export function MarketingFooter() {
  return (
    <footer className="bg-brand-950 py-14 text-white">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <BrandLogo href="/" light size="sm" />
          <p className="text-center text-sm text-white/40 sm:text-left">{BRAND.footer}</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link href="/help" className="text-teal-400 hover:underline">
              Help & contact
            </Link>
            <Link href="/privacy" className="text-white/50 hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="text-white/50 hover:text-white">
              Terms
            </Link>
            <Link href="/login" className="text-white/50 hover:text-white">
              Sign in
            </Link>
            <Link href="/signup" className="text-gold-400 hover:underline">
              Start free trial
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-white/30">
          TCPA-ready · HIPAA available on Enterprise · Audit logs included
        </p>
      </div>
    </footer>
  );
}
