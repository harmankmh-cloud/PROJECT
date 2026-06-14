import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { BRAND } from "@/lib/brand";

export function SiteFooter({ dark = false }: { dark?: boolean }) {
  if (dark) {
    return (
      <footer className="bg-brand-950 py-14 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-4 sm:flex-row sm:px-8">
          <BrandLogo light size="sm" />
          <p className="text-center text-sm text-white/40 sm:text-left">{BRAND.footer}</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link href="/help" className="text-teal-400 hover:underline">
              Help & contact
            </Link>
            <Link href="/pricing" className="text-white/50 hover:text-white">
              Pricing
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
              Sign up free
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-slate-200/70 bg-white/80 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-8">
        <BrandLogo size="sm" />
        <p className="text-center text-xs text-slate-500 sm:text-left">{BRAND.footer}</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/help" className="text-slate-600 hover:text-gold-600">
            Help
          </Link>
          <Link href="/pricing" className="text-slate-600 hover:text-gold-600">
            Pricing
          </Link>
          <Link href="/privacy" className="text-slate-600 hover:text-gold-600">
            Privacy
          </Link>
          <Link href="/terms" className="text-slate-600 hover:text-gold-600">
            Terms
          </Link>
          <Link href="/login" className="text-slate-600 hover:text-gold-600">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  );
}
