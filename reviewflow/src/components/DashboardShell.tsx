"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Phone,
  QrCode,
  Send,
  Settings,
  Star,
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { BRAND } from "@/lib/brand";

const ownerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/share", label: "Review Requests", icon: Send },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/share", label: "QR Codes", icon: QrCode },
  { href: "/dashboard/calls", label: "CallLocal", icon: Phone },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export function DashboardShell({
  businessName,
  reviewSlug,
  planLabel = "Free Trial",
  isPlatformAdmin,
  children,
}: {
  businessName?: string;
  reviewSlug?: string;
  planLabel?: string;
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
    <div className="flex h-full w-[220px] flex-col">
      <div className="border-b border-border px-5 py-5">
        <Link href="/dashboard" className="font-display text-lg text-text">
          {BRAND.name}
        </Link>
        {businessName && (
          <p className="mt-2 truncate text-sm text-muted">{businessName}</p>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`nav-item ${active ? "nav-item-active" : ""}`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-xl bg-surface px-3 py-2 text-xs text-muted">{planLabel}</div>
        <Link href="/dashboard/billing" className="btn-primary-pill mt-3 block py-2 text-center text-xs">
          Upgrade
        </Link>
        {isPlatformAdmin && (
          <Link href="/admin" className="mt-2 block text-xs text-primary hover:underline">
            Platform panel →
          </Link>
        )}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-3 flex w-full items-center gap-2 px-2 text-sm text-muted hover:text-text disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <aside className="sidebar-shell hidden shrink-0 lg:block">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-text/40"
            style={{ WebkitBackdropFilter: "blur(4px)", backdropFilter: "blur(4px)" }}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <aside className="sidebar-shell relative h-full w-[220px] bg-white shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-white">
        <header className="site-header flex items-center justify-between px-4 py-3 lg:hidden">
          <span className="font-display text-text">{BRAND.name}</span>
          <button type="button" className="btn-ghost px-3 py-2" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
