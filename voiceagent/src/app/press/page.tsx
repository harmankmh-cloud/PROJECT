import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { PRESS_KIT } from "@/lib/press-kit";
import { BRAND } from "@/lib/brand";

export const metadata = marketingMetadata({
  title: "Press kit",
  description: `Media assets and boilerplate for ${BRAND.name}.`,
  path: "/press",
});


export default function PressPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto max-w-2xl">
          <p className="section-eyebrow mb-3">Press</p>
          <h1 className="font-display text-4xl text-ghost-white">Press kit</h1>
          <p className="mt-4 text-lg text-on-surface-variant">{PRESS_KIT.headline}</p>

          <section className="glass-card mt-10 p-8">
            <h2 className="font-display text-lg text-text">Boilerplate</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">{PRESS_KIT.boilerplate}</p>
          </section>

          <section className="mt-8">
            <h2 className="font-display text-lg text-text">Quick facts</h2>
            <ul className="mt-4 space-y-2">
              {PRESS_KIT.facts.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-muted">
                  <span className="text-accent">·</span>
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="font-display text-lg text-text">Assets</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {PRESS_KIT.assets.map((a) => (
                <li key={a.label}>
                  <a href={a.href} className="text-primary-glow hover:underline">
                    {a.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 text-sm text-muted">
            <p>
              Media inquiries:{" "}
              <a href={`mailto:${PRESS_KIT.contact}`} className="text-primary-glow hover:underline">
                {PRESS_KIT.contact}
              </a>
            </p>
            <p className="mt-2">
              <a href={PRESS_KIT.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn
              </a>
              {" · "}
              <a href={PRESS_KIT.social.x} target="_blank" rel="noopener noreferrer" className="hover:underline">
                X
              </a>
            </p>
          </section>
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}
