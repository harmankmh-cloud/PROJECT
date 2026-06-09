import Link from "next/link";
import { MarketingFooterNew } from "@/components/marketing/MarketingFooterNew";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { SkipToContent } from "@/components/SkipToContent";
import { DOCS_NAV } from "@/lib/docs-content";

export function DocsShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="dark-mesh-bg grid-pattern flex min-h-screen flex-col">
      <SkipToContent />
      <MarketingNavbar />
      <main id="main-content" className="flex-1 pb-16 pt-24">
        <div className="marketing-container mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row">
          <aside className="lg:w-48 lg:shrink-0">
            <p className="section-eyebrow mb-3">Docs</p>
            <nav className="flex flex-row flex-wrap gap-2 lg:flex-col lg:gap-1" aria-label="Documentation">
              {DOCS_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-surface hover:text-text"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <article className="min-w-0 flex-1">
            <h1 className="font-display text-3xl text-ghost-white md:text-4xl">{title}</h1>
            <div className="prose-docs mt-8 space-y-8">{children}</div>
          </article>
        </div>
      </main>
      <MarketingFooterNew />
    </div>
  );
}

export function DocsSection({
  heading,
  body,
  code,
}: {
  heading: string;
  body: string;
  code?: string;
}) {
  return (
    <section>
      <h2 className="font-display text-xl text-text">{heading}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
      {code && (
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-bg/80 p-4 text-xs text-text">
          <code>{code}</code>
        </pre>
      )}
    </section>
  );
}
