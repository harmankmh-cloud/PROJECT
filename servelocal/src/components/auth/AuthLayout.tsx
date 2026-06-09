import Link from "next/link";
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
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="marketing-grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2">
          <span className="font-display text-xl font-black text-slate-50">
            {SERVE_LOCAL.name}
            <span className="text-primary">.</span>
          </span>
          <span className="text-xs text-slate-500">🍁 BC</span>
        </Link>
        <div className="rounded-3xl border border-slate-700 bg-surface p-8 shadow-2xl shadow-black/30 sm:p-10">
          <h1 className="font-display text-2xl font-black text-slate-50">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
