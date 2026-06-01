import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PricingCards } from "@/components/PricingCards";
import { SERVE_LOCAL } from "@/lib/constants";

export default function PricingPage() {
  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <p className="section-eyebrow">{SERVE_LOCAL.name} for pros</p>
        <h1 className="font-display mt-2 text-4xl text-brand-950">Plans that pay for themselves</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Angi and Thumbtack charge $30–100+ per lead. ServeLocal lets customers call you direct — upgrade for visibility, verified badges, and premium placement.
        </p>
        <div className="mt-12">
          <PricingCards />
        </div>
        <div className="surface-card mt-12 p-8">
          <h2 className="font-display text-xl text-brand-950">What every plan includes</h2>
          <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <li>✓ Phone & WhatsApp on your profile</li>
            <li>✓ Customer reviews (moderated)</li>
            <li>✓ Listed in city + category pages</li>
            <li>✓ Contact click analytics</li>
            <li>✓ BC-focused Fraser Valley & Metro coverage</li>
            <li>✓ No per-lead fees for customers</li>
          </ul>
          <p className="mt-6 text-xs text-slate-500">
            Setup fees cover profile review and verification. Monthly plans billed after approval — payment integration coming soon; contact us to activate Featured/Premium today.
          </p>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
