import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SERVE_LOCAL } from "@/lib/constants";

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="marketing-grid-bg-light pointer-events-none absolute inset-0 opacity-40" />
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2">
          <span className="font-display text-xl font-black text-foreground">
            {SERVE_LOCAL.name}
            <span className="text-primary">.</span>
          </span>
          <span className="text-xs text-muted">🍁 Canada</span>
        </Link>
        <div className="rounded-[14px] border border-border bg-surface p-8 shadow-xl sm:p-10">
          <h1 className="font-display text-2xl font-black text-foreground">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
