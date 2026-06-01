"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";

/** Simple nav for business owners — no advanced/platform settings */
const ownerLinks = [
  { href: "/dashboard", label: "Home", icon: "◉" },
  { href: "/dashboard/reviews", label: "My reviews", icon: "⭐" },
  { href: "/dashboard/share", label: "QR & sharing", icon: "📱" },
  { href: "/dashboard/settings", label: "My business", icon: "⚙" },
  { href: "/dashboard/billing", label: "My plan", icon: "◈" },
  { href: "/dashboard/help", label: "Help & contact", icon: "?" },
];

export function DashboardShell({
  businessName,
  reviewSlug,
  isPlatformAdmin,
  children,
}: {
  businessName?: string;
  reviewSlug?: string;
  isPlatformAdmin?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const links = reviewSlug ? ownerLinks : [ownerLinks[0]];

  async function handleLogout() {
    if (!isSupabaseConfigured()) {
      router.push("/login");
      return;
    }
    setLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-5">
        <BrandLogo href="/dashboard" light />
        {businessName ? (
          <>
            <p className="mt-3 truncate text-sm font-medium text-white/80">{businessName}</p>
            <p className="text-xs text-white/40">Business dashboard</p>
          </>
        ) : (
          <p className="mt-3 text-sm text-white/40">Finish setup to go live</p>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`nav-item ${active ? "nav-item-active" : ""}`}
            >
              <span className="text-base opacity-80">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
        {reviewSlug && (
          <Link
            href={`/r/${reviewSlug}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMobileOpen(false)}
            className="nav-item"
          >
            <span className="text-base opacity-80">↗</span>
            Preview my page
          </Link>
        )}
      </nav>

      {isPlatformAdmin && (
        <div className="border-t border-white/10 px-3 py-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gold-500/20 to-mint-500/15 px-3.5 py-2.5 text-sm font-semibold text-mint-400 transition hover:from-gold-500/30 hover:to-mint-500/25"
          >
            🛡 Platform panel →
          </Link>
        </div>
      )}

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
        >
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream lg:flex">
      <aside className="sidebar-shell sidebar-accent hidden w-64 shrink-0 lg:block">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <aside className="sidebar-shell sidebar-accent relative h-full w-72 shadow-2xl">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="site-header flex items-center justify-between px-4 py-3 lg:hidden">
          <BrandLogo href="/dashboard" size="sm" />
          <button type="button" className="btn-ghost px-3 py-2" onClick={() => setMobileOpen(true)}>
            Menu
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
