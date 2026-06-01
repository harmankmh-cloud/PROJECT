import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { BRAND } from "@/lib/brand";

export function AuthMarketingPanel({ footer }: { footer: string }) {
  const items = [
    "1–5 star flow on any phone",
    "AI review drafts in seconds",
    "Private channel for unhappy customers",
    "Print-ready QR + share kit",
  ];

  return (
    <div className="sidebar-shell relative hidden w-[42%] max-w-md flex-col justify-between overflow-hidden p-10 2xl:max-w-xl 2xl:p-12 lg:flex">
      <div className="hero-glow -left-24 top-0 h-80 w-80 bg-teal-500/20" />
      <div className="hero-glow bottom-0 right-0 h-72 w-72 bg-amber-500/15" />
      <div className="relative">
        <BrandLogo href="/" light size="lg" />
        <h2 className="font-display mt-10 text-4xl leading-tight text-white">
          The review page
          <br />
          <span className="bg-gradient-to-r from-amber-200 to-teal-300 bg-clip-text text-transparent">
            your shop deserves
          </span>
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
          {BRAND.name} gives local businesses a polished QR experience — not a cold Google form.
        </p>
      </div>
      <ul className="relative space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 text-sm text-white/85">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/30 to-teal-500/25 text-sm text-teal-300">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
      <div className="relative flex items-center justify-between gap-4 text-xs text-white/35">
        <p>{footer}</p>
        <Link href="/help" className="text-teal-400/80 hover:text-teal-300 hover:underline">
          Help →
        </Link>
      </div>
    </div>
  );
}
