import Link from "next/link";

const adminLinks = [
  { href: "/admin", label: "Platform overview", icon: "◉" },
  { href: "/admin/businesses", label: "All businesses", icon: "🏪" },
  { href: "/admin/settings", label: "Platform settings", icon: "⚙" },
];

export function AdminHubBanner() {
  return (
    <div className="surface-card overflow-hidden border-gold-500/30">
      <div className="border-b border-[#e8e2d9] bg-brand-950 px-6 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">Full access</p>
        <h2 className="font-display mt-1 text-xl">You have admin + business owner access</h2>
        <p className="mt-1 text-sm text-white/60">
          This page is your business dashboard. Use the platform panel to manage every account on
          RateLocal.
        </p>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-3">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center gap-3 rounded-xl border border-[#e8e2d9] bg-cream px-4 py-3 transition hover:border-gold-500/40 hover:bg-white"
          >
            <span className="text-lg">{link.icon}</span>
            <span className="text-sm font-semibold text-brand-950 group-hover:text-gold-600">
              {link.label} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
