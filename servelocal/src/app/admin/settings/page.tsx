import Link from "next/link";
import { SmtpSetupGuide } from "@/components/SmtpSetupGuide";
import { SERVE_LOCAL } from "@/lib/constants";

export default function AdminSettingsPage() {
  const adminEmails = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "(not set)";

  return (
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <Link href="/admin" className="text-sm font-semibold text-teal-600 hover:underline">
            ← Directory
          </Link>
          <p className="page-eyebrow mt-4">{SERVE_LOCAL.name} admin</p>
          <h1 className="font-display mt-1 text-3xl font-bold text-zinc-900">Platform settings</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Email and server configuration — visible only to admins.
          </p>
        </header>

        <SmtpSetupGuide />

        <div className="surface-card p-6">
          <h2 className="font-semibold text-brand-950">Supabase SQL (run order)</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-600">
            <li>servelocal.sql</li>
            <li>premium.sql</li>
            <li>suggestions.sql</li>
            <li>guest-access.sql</li>
            <li>user-accounts.sql</li>
          </ol>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-semibold text-brand-950">Platform admins</h2>
          <p className="mt-2 text-sm text-slate-600">
            Emails in <code className="text-xs">ADMIN_EMAILS</code> can access this panel:
          </p>
          <p className="mt-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-brand-950">{adminEmails}</p>
        </div>
      </div>
    </main>
  );
}
