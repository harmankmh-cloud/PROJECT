import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function DashboardFooter() {
  return (
    <footer className="hidden w-full border-t border-glass-border-subtle bg-surface-container/30 py-16 backdrop-blur-xl md:block">
      <div className="dashboard-container grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <span className="font-display block text-xl font-bold text-ghost-white">{BRAND.name}</span>
          <p className="mt-4 text-sm text-on-surface-variant">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase text-ghost-white">Resources</span>
          <Link href="/privacy" className="text-sm text-on-surface-variant hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-on-surface-variant hover:text-primary">
            Terms of Service
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase text-ghost-white">Company</span>
          <Link href="/security" className="text-sm text-on-surface-variant hover:text-primary">
            Compliance
          </Link>
          <Link href="/dashboard/settings" className="text-sm text-on-surface-variant hover:text-primary">
            Settings
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase text-ghost-white">Contact</span>
          <a
            href={`mailto:${BRAND.contact.supportEmail}`}
            className="text-sm text-on-surface-variant hover:text-primary"
          >
            {BRAND.contact.supportEmail}
          </a>
          <Link href="/help" className="text-sm text-on-surface-variant hover:text-primary">
            Help & support
          </Link>
        </div>
      </div>
    </footer>
  );
}
