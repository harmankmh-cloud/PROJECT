import Link from "next/link";

const steps = [
  {
    title: "1. Resend account",
    body: "Create an API key in your Resend dashboard and verify your sending domain.",
    href: "https://resend.com/signup",
    cta: "Open Resend →",
  },
  {
    title: "2. Supabase custom SMTP",
    body: "In Supabase → Project Settings → Authentication → SMTP, use smtp.resend.com on port 465 with user resend and your API key as the password.",
    href: "https://supabase.com/dashboard",
    cta: "Open Supabase →",
  },
  {
    title: "3. Rate limits",
    body: "Supabase’s built-in email is capped at a few messages per hour. Custom SMTP removes that limit for sign-up and password-reset emails.",
    href: "https://supabase.com/dashboard/project/_/settings/auth",
    cta: "Supabase SMTP settings →",
  },
];

export function SmtpSetupGuide() {
  return (
    <div className="surface-card overflow-hidden border-amber-200/60">
      <div className="border-b border-amber-200/80 bg-amber-50 px-6 py-4">
        <h2 className="font-semibold text-amber-950">Auth email (SMTP)</h2>
        <p className="mt-1 text-sm text-amber-900/80">
          Configure Resend SMTP in Supabase for homeowner and tradie sign-up and password reset emails.
        </p>
      </div>
      <div className="space-y-4 p-6">
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
          <p className="font-semibold">Accounts are optional</p>
          <p className="mt-1">
            Guests can still post jobs. Signed-in homeowners track requests on{" "}
            <Link href="/dashboard" className="font-semibold underline">
              My account
            </Link>
            .
          </p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          <p className="font-semibold">“Email rate limit exceeded”?</p>
          <p className="mt-1">
            Enable <strong>custom SMTP</strong> in Supabase Authentication settings using your Resend credentials.
          </p>
        </div>
        {steps.map((step) => (
          <div key={step.title} className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="font-semibold text-brand-950">{step.title}</p>
            <p className="mt-1 text-sm text-slate-600">{step.body}</p>
            <a
              href={step.href}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-teal-600 hover:underline"
            >
              {step.cta}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
