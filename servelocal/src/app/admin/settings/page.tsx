import Link from "next/link";
import { SmtpSetupGuide } from "@/components/SmtpSetupGuide";
import { SERVE_LOCAL } from "@/lib/constants";

export default function AdminSettingsPage() {
  const adminCount = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean).length;

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <Link href="/admin#listings" className="text-sm font-semibold text-teal-600 hover:underline">
            ← Listings
          </Link>
          <p className="page-eyebrow mt-4">{SERVE_LOCAL.name} admin</p>
          <h1 className="font-display mt-1 text-3xl font-bold text-zinc-900">Platform settings</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Email configuration — visible only to platform admins.
          </p>
        </header>

        <SmtpSetupGuide />

        <div className="surface-card p-6">
          <h2 className="font-semibold text-brand-950">Platform admins</h2>
          <p className="mt-2 text-sm text-slate-600">
            {adminCount > 0
              ? `${adminCount} admin email${adminCount === 1 ? "" : "s"} configured via ADMIN_EMAILS.`
              : "No admin emails configured — set ADMIN_EMAILS in your deployment environment."}
          </p>
        </div>
      </div>
    </main>
  );
}
