import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SERVE_LOCAL } from "@/lib/constants";

export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
        <Link href="/" className="text-sm font-semibold text-teal-600 hover:underline">
          ← {SERVE_LOCAL.name}
        </Link>
        <h1 className="font-display mt-6 text-3xl text-brand-950 sm:text-4xl">{title}</h1>
        <div className="surface-card prose-legal mt-8 space-y-6 p-6 sm:p-8">{children}</div>
      </article>
      <SiteFooter />
    </main>
  );
}
