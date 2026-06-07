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
          Thumbtack and Angi charge <strong>$25–75 per lead</strong> — shared with 3–10 other pros. Ten leads can cost <strong>$500+/mo</strong> for jobs you might never win. ServeLocal is one flat monthly fee, your phone rings direct, and there are <strong>no per-lead fees</strong>.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["Thumbtack", "$25–75 / lead", "shared with 4–5 pros"],
            ["HomeStars", "$299–599/mo", "+ $10–100 per lead"],
            ["ServeLocal", "$49/mo flat", "exclusive profile, $0 per lead"],
          ].map(([name, price, note], i) => (
            <div
              key={name}
              className={
                i === 2
                  ? "rounded-2xl border-2 border-teal-500 bg-teal-50 p-4"
                  : "rounded-2xl border border-slate-200 bg-white p-4"
              }
            >
              <p className="text-sm font-semibold text-brand-950">{name}</p>
              <p className="font-display mt-1 text-xl text-brand-950">{price}</p>
              <p className="mt-1 text-xs text-slate-500">{note}</p>
            </div>
          ))}
        </div>
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
            No setup fees. Pay monthly or save with annual (2 months free). Plans billed after profile approval — contact us to activate Featured/Premium today.
          </p>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
