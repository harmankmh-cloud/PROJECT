import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BRAND } from "@/lib/brand";

export function DashboardFooter() {
  return (
    <footer className="hidden w-full border-t border-outline-variant/20 bg-primary-container py-[120px] md:block">
      <div className="dashboard-container grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <span className="font-display block text-xl font-bold text-on-primary">{BRAND.name}</span>
          <p className="mt-4 text-sm text-on-primary-container">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase text-on-primary">Resources</span>
          <Link href="/privacy" className="text-sm text-on-primary-container/80 hover:text-on-primary">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-on-primary-container/80 hover:text-on-primary">
            Terms of Service
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase text-on-primary">Company</span>
          <Link href="/security" className="text-sm text-on-primary-container/80 hover:text-on-primary">
            Compliance
          </Link>
          <Link href="/dashboard/settings" className="text-sm text-on-primary-container/80 hover:text-on-primary">
            Settings
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase text-on-primary">Social</span>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/company/intellivohealth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-primary-container/80 hover:text-secondary"
              aria-label="LinkedIn"
            >
              <MaterialIcon name="share" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
