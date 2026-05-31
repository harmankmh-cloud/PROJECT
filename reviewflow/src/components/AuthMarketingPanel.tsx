import { BrandLogo } from "@/components/BrandLogo";

export function AuthMarketingPanel({ footer }: { footer: string }) {
  const items = [
    "1–5 star flow on any phone",
    "AI review drafts in seconds",
    "Private channel for unhappy customers",
    "Print-ready QR + share kit",
  ];

  return (
    <div className="sidebar-shell relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex">
      <div className="hero-glow -left-20 top-0 h-72 w-72 bg-mint-500/15" />
      <div className="hero-glow bottom-0 right-0 h-64 w-64 bg-gold-500/10" />
      <div className="relative">
        <BrandLogo href="/" light />
      </div>
      <ul className="relative space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 text-sm text-white/80">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500/25 to-mint-500/20 text-mint-400">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
      <p className="relative text-xs text-white/35">{footer}</p>
    </div>
  );
}
