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
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-display text-xl text-text">
          <Star className="h-6 w-6 fill-primary text-primary" />
          {BRAND.name}
        </Link>
        <div className="auth-card">
          <h1 className="font-display text-2xl text-text">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtext}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
