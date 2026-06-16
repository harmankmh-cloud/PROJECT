import Link from "next/link";
import { Star } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { MARKETING } from "@/content/copy";

export function PublicAuthLayout({
  children,
  title,
  subtext,
}: {
  children: React.ReactNode;
  title: string;
  subtext: string;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 font-display text-xl font-bold text-text"
      >
        <Star className="h-6 w-6 fill-star text-star" />
        {BRAND.name}
      </Link>
      <div className="card-glow w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-bold text-text">{title}</h1>
        <p className="mt-2 text-sm text-muted">{subtext}</p>
        <div className="mt-8">{children}</div>
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        {MARKETING.hero.trustBadges[1]}
      </p>
    </div>
  );
}
