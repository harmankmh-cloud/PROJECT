"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "◉" },
  { href: "/dashboard/agents", label: "Agents", icon: "🤖" },
  { href: "/dashboard/phone-numbers", label: "Phone Numbers", icon: "☎" },
  { href: "/dashboard/knowledge", label: "Knowledge", icon: "📚" },
  { href: "/dashboard/calls", label: "Calls", icon: "📞" },
  { href: "/dashboard/flows", label: "Flows", icon: "◇" },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: "📣" },
  { href: "/dashboard/integrations", label: "Integrations", icon: "🔗" },
  { href: "/dashboard/compliance", label: "Compliance", icon: "🛡" },
  { href: "/dashboard/channels", label: "Channels", icon: "💬" },
  { href: "/dashboard/billing", label: "Billing", icon: "◈" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
  { href: "/dashboard/help", label: "Help", icon: "?" },
];

export function DashboardShell({
  orgName,
  userEmail,
  children,
}: {
  orgName?: string;
  userEmail?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
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
        {orgName ? (
          <>
            <p className="mt-3 truncate text-sm font-medium text-white/80">{orgName}</p>
            <p className="truncate text-xs text-white/40">{userEmail || "Voice AI dashboard"}</p>
          </>
        ) : (
          <p className="mt-3 text-sm text-white/40">Finish setup to go live</p>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const active =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`nav-item ${active ? "nav-item-active" : ""}`}
            >
              <span className="text-base opacity-80">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          onClick={() => setMobileOpen(false)}
          className="nav-item"
        >
          <span className="text-base opacity-80">↗</span>
          View site
        </Link>
      </nav>

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
      <aside className="sidebar-shell hidden w-64 shrink-0 lg:block">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <aside className="sidebar-shell relative h-full w-72 shadow-2xl">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="site-header flex items-center justify-between px-4 py-3 lg:hidden">
          <BrandLogo href="/dashboard" size="sm" />
          <button type="button" className="btn-ghost px-3 py-2" onClick={() => setMobileOpen(true)}>
            Menu
          </button>
        </header>
        <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
