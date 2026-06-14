import Link from "next/link";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { SERVE_LOCAL } from "@/lib/constants";

export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <MarketingPageShell>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
        <Link href="/" className="text-sm font-semibold text-primary hover:underline">
          ← {SERVE_LOCAL.name}
        </Link>
        <h1 className="font-display mt-6 text-3xl font-black text-foreground sm:text-4xl">{title}</h1>
        <div className="prose-legal mt-8 space-y-6 rounded-[14px] border border-border bg-surface p-6 sm:p-8">
          {children}
        </div>
      </article>
    </MarketingPageShell>
  );
}
