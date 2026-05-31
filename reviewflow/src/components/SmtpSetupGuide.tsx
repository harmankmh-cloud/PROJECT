import Link from "next/link";

const steps = [
  {
    title: "1. Resend (free email service)",
    body: "Sign up at resend.com → API Keys → create key (starts with re_)",
    href: "https://resend.com/signup",
    cta: "Open Resend →",
  },
  {
    title: "2. Supabase SMTP",
    body: "Project Settings → Authentication → SMTP: host smtp.resend.com, port 465, user resend, password = API key",
    href: "https://supabase.com/dashboard",
    cta: "Open Supabase →",
  },
  {
    title: "3. Confirm email ON",
    body: "Authentication → Providers → Email → turn Confirm email ON so signups get a one-tap link",
    href: "https://supabase.com/dashboard",
    cta: "Supabase Auth →",
  },
];

export function SmtpSetupGuide() {
  return (
    <div className="surface-card overflow-hidden border-amber-200/60">
      <div className="border-b border-amber-200/80 bg-amber-50 px-6 py-4">
        <h2 className="font-semibold text-amber-950">Signup emails (SMTP)</h2>
        <p className="mt-1 text-sm text-amber-900/80">
          Set this up so new business owners get confirm & password-reset emails without rate limits.
        </p>
      </div>
      <div className="space-y-4 p-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          <p className="font-semibold">“Error sending confirmation email”?</p>
          <p className="mt-1">
            Verify <strong>ratelocal.ca</strong> in{" "}
            <a href="https://resend.com/domains" className="font-semibold underline" target="_blank" rel="noreferrer">
              Resend → Domains
            </a>
            , or turn <strong>Confirm email OFF</strong> in Supabase for instant signup.
          </p>
        </div>
        {steps.map((step) => (
          <div key={step.title} className="rounded-xl border border-[#e8e2d9] bg-cream p-4">
            <p className="font-semibold text-brand-950">{step.title}</p>
            <p className="mt-1 text-sm text-stone-600">{step.body}</p>
            <a
              href={step.href}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-gold-600 hover:underline"
            >
              {step.cta}
            </a>
          </div>
        ))}
        <p className="text-sm text-stone-600">
          Full step-by-step:{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs">reviewflow/SMTP_SETUP.md</code> in
          GitHub
        </p>
        <Link href="/signup" className="btn-ghost inline-flex px-4 py-2 text-sm">
          Test signup page →
        </Link>
      </div>
    </div>
  );
}
