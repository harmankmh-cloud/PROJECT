import Link from "next/link";

const steps = [
  {
    title: "1. Resend (same as RateLocal)",
    body: "resend.com → API Keys → key starts with re_",
    href: "https://resend.com/signup",
    cta: "Open Resend →",
  },
  {
    title: "2. Supabase custom SMTP",
    body: "Project Settings → Authentication → SMTP: smtp.resend.com, port 465, user resend, password = API key",
    href: "https://supabase.com/dashboard",
    cta: "Open Supabase →",
  },
  {
    title: "3. Rate limit fix",
    body: "Free Supabase email = ~2–4/hour. Resend SMTP removes that cap (already shared if RateLocal is set up).",
    href: "https://supabase.com/dashboard/project/_/settings/auth",
    cta: "Supabase SMTP →",
  },
];

export function SmtpSetupGuide() {
  return (
    <div className="surface-card overflow-hidden border-amber-200/60">
      <div className="border-b border-amber-200/80 bg-amber-50 px-6 py-4">
        <h2 className="font-semibold text-amber-950">Auth emails (Resend SMTP)</h2>
        <p className="mt-1 text-sm text-amber-900/80">
          Same Resend + Supabase SMTP as RateLocal. Used for homeowner/tradie sign-up and password reset.
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
            Turn on <strong>custom SMTP (Resend)</strong> in Supabase — see{" "}
            <code className="rounded bg-white px-1 text-xs">servelocal/SMTP_SETUP.md</code> and{" "}
            <code className="rounded bg-white px-1 text-xs">reviewflow/SMTP_SETUP.md</code>.
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
