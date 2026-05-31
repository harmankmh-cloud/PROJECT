import Link from "next/link";

const links = [
  {
    title: "Revenue & payments",
    description: "Every charge, subscription, payout, refund — your money lives here.",
    href: "https://dashboard.stripe.com/dashboard",
    cta: "Open Stripe Dashboard →",
  },
  {
    title: "Sign-ups & login emails",
    description: "All user accounts, auth logs, email rate limits, confirm-email setting.",
    href: "https://supabase.com/dashboard",
    cta: "Open Supabase →",
  },
  {
    title: "Website deploys",
    description: "See if ratelocal.ca is live, env vars, build errors.",
    href: "https://vercel.com/dashboard",
    cta: "Open Vercel →",
  },
  {
    title: "Google search",
    description: "Sitemap status, indexing, search performance.",
    href: "https://search.google.com/search-console",
    cta: "Open Search Console →",
  },
];

export function AdminOwnerGuide() {
  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <h2 className="font-semibold text-brand-950">Where to check everything</h2>
        <p className="mt-2 text-sm text-stone-600">
          RateLocal admin shows businesses & reviews. <strong>Revenue is in Stripe</strong> — not
          inside this app yet.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {links.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-[#e8e2d9] bg-cream p-4 transition hover:border-gold-500/40 hover:bg-white"
            >
              <p className="font-semibold text-brand-950">{item.title}</p>
              <p className="mt-1 text-sm text-stone-600">{item.description}</p>
              <p className="mt-3 text-sm font-semibold text-gold-600">{item.cta}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="surface-card p-6">
        <h2 className="font-semibold text-brand-950">If “email rate limit exceeded” happens again</h2>
        <ul className="mt-3 space-y-2 text-sm text-stone-600">
          <li>
            <strong>Right now (testing):</strong> Supabase → Authentication → Providers → Email →
            keep <strong>Confirm email OFF</strong> so sign-up does not send emails.
          </li>
          <li>
            <strong>Many real customers:</strong> Upgrade Supabase to <strong>Pro</strong> ($25/mo)
            for higher email limits.
          </li>
          <li>
            <strong>Production scale:</strong> Supabase → Project Settings → Auth →{' '}
            <strong>Custom SMTP</strong> (Resend, SendGrid, etc.) — you control sending limits.
          </li>
          <li>
            <strong>Do not</strong> spam signup button — each click can send an email when confirm
            is ON.
          </li>
        </ul>
      </div>

      <div className="surface-card p-6">
        <h2 className="font-semibold text-brand-950">Inside RateLocal (this app)</h2>
        <ul className="mt-3 space-y-2 text-sm text-stone-600">
          <li>
            <Link href="/admin" className="font-semibold text-gold-600 hover:underline">
              Platform overview
            </Link>{' '}
            — total businesses, reviews, Pro vs trial counts
          </li>
          <li>
            <Link href="/admin/businesses" className="font-semibold text-gold-600 hover:underline">
              All businesses
            </Link>{' '}
            — every account, plan, visits, review counts
          </li>
          <li>
            <Link href="/dashboard" className="font-semibold text-gold-600 hover:underline">
              Your business dashboard
            </Link>{' '}
            — your barber shop stats, QR, billing
          </li>
          <li>
            <Link href="/dashboard/billing" className="font-semibold text-gold-600 hover:underline">
              My plan
            </Link>{' '}
            — your own subscription & usage
          </li>
          <li>
            <Link href="/admin/messages" className="font-semibold text-gold-600 hover:underline">
              User messages
            </Link>{' '}
            — help & suggestions from business owners
          </li>
        </ul>
      </div>
    </div>
  );
}
