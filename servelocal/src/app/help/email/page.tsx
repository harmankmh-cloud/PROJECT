import Link from "next/link";
import { SmtpSetupGuide } from "@/components/SmtpSetupGuide";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SERVE_LOCAL } from "@/lib/constants";

/** Site-owner docs only — not linked from public login/signup. */
export default function EmailHelpPage() {
  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-8">
        <Link href="/login" className="text-sm font-semibold text-teal-600 hover:underline">
          ← Back to sign in
        </Link>
        <h1 className="font-display mt-4 text-2xl text-brand-950">Email setup for {SERVE_LOCAL.name}</h1>
        <p className="mt-2 text-sm text-slate-600">
          For site owners fixing sign-up emails (Resend + Supabase). Customers do not need this page.
        </p>
        <div className="mt-8">
          <SmtpSetupGuide />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
