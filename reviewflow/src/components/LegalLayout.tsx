import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteFooter } from "@/components/SiteFooter";

export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mesh-bg min-h-screen">
      <header className="site-header">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-8">
          <BrandLogo />
          <Link href="/" className="btn-ghost px-4 py-2 text-sm">
            Home
          </Link>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
        <h1 className="font-display text-3xl text-brand-950 sm:text-4xl">{title}</h1>
        <div className="surface-card prose-legal mt-8 space-y-6 p-6 sm:p-8">{children}</div>
      </article>
      <SiteFooter />
    </main>
  );
}
