import Link from "next/link";
import { Star } from "lucide-react";
import { BRAND } from "@/lib/brand";

export function AuthLayout({
  children,
  title,
  subtext,
}: {
  children: React.ReactNode;
  title: string;
  subtext: string;
}) {
  return (
    <main className="marketing-page flex min-h-screen flex-col items-center justify-center bg-surface/50 px-4 py-12">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(244,63,94,0.08),transparent_55%)]" />
      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 font-display text-xl text-text transition hover:text-primary"
        >
          <Star className="h-6 w-6 fill-star text-star" />
          {BRAND.name}
        </Link>
        <div className="auth-card border-primary/10 shadow-xl shadow-primary/5">
          <h1 className="font-display text-2xl text-text">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{subtext}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
