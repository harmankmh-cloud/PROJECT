import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { CHANGELOG } from "@/lib/changelog";
import { BRAND } from "@/lib/brand";

export const metadata = marketingMetadata({
  title: "Changelog",
  description: `What's new in ${BRAND.name} — product updates, improvements, and fixes.`,
  path: "/changelog",
});


const TAG_STYLES: Record<string, string> = {
  New: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Improved: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  Fixed: "border-amber-500/30 bg-amber-500/10 text-amber-400",
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ChangelogPage() {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <LandingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto max-w-3xl">
          <p className="section-eyebrow mb-3">Changelog</p>
          <h1 className="font-display text-4xl text-ghost-white">What&apos;s new in {BRAND.name}</h1>
          <p className="mt-4 text-on-surface-variant">
            Shipping steadily. Every meaningful update lands here.
          </p>

          <div className="mt-12 space-y-0">
            {CHANGELOG.map((entry, i) => (
              <article
                key={entry.date + entry.title}
                className={`relative border-l border-border pb-12 pl-8 ${
                  i === CHANGELOG.length - 1 ? "pb-0" : ""
                }`}
              >
                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-violet-500" />
                <div className="flex flex-wrap items-center gap-3">
                  <time className="text-sm text-muted" dateTime={entry.date}>
                    {formatDate(entry.date)}
                  </time>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${TAG_STYLES[entry.tag]}`}
                  >
                    {entry.tag}
                  </span>
                </div>
                <h2 className="font-display mt-2 text-xl text-text">{entry.title}</h2>
                <ul className="mt-3 space-y-2">
                  {entry.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
