"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MaterialIcon } from "@/components/MaterialIcon";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { BRAND } from "@/lib/brand";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "home" },
  { href: "/dashboard/agents", label: "Agents", icon: "smart_toy" },
  { href: "/dashboard/phone-numbers", label: "Phone Numbers", icon: "call" },
  { href: "/dashboard/knowledge", label: "Knowledge", icon: "menu_book" },
  { href: "/dashboard/calls", label: "Calls", icon: "call_log" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "bar_chart" },
  { href: "/dashboard/sandbox", label: "Sandbox", icon: "science" },
  { href: "/dashboard/flows", label: "Flows", icon: "account_tree" },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: "campaign" },
  { href: "/dashboard/integrations", label: "Integrations", icon: "hub" },
  { href: "/dashboard/compliance", label: "Compliance", icon: "shield" },
  { href: "/dashboard/channels", label: "Channels", icon: "forum" },
  { href: "/dashboard/billing", label: "Billing", icon: "payments" },
  { href: "/dashboard/team", label: "Team", icon: "group" },
  { href: "/dashboard/developer", label: "Developer", icon: "code" },
  { href: "/dashboard/audit", label: "Audit", icon: "history" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
  { href: "/dashboard/help", label: "Help", icon: "help" },
] as const;

const MOBILE_NAV = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/dashboard/agents", label: "Agents", icon: "smart_toy" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "bar_chart" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
] as const;

function userInitials(email?: string) {
  if (!email) return "?";
  const local = email.split("@")[0] || "";
  return local.slice(0, 2).toUpperCase();
}

function NavLink({
  item,
  active,
  onClick,
  compact,
}: {
  item: (typeof NAV)[number];
  active: boolean;
  onClick?: () => void;
  compact?: boolean;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active ? "nav-item-active" : "nav-item"
      } ${compact ? "px-2.5" : ""}`}
    >
      <MaterialIcon name={item.icon} className="text-[20px]" filled={active} />
      {!compact && item.label}
    </Link>
  );
}

export function DashboardShell({
  orgName,
  userEmail,
  isPlatformAdmin,
  children,
}: {
  orgName?: string;
  userEmail?: string;
  isPlatformAdmin?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
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

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <div className="page-shell min-h-screen text-on-surface">
      {/* Desktop sidebar */}
      <aside className="sidebar-shell fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-glass-border-subtle px-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-electric-cyan/30">
              <MaterialIcon name="smart_toy" filled className="text-primary" />
            </div>
            <div>
              <span className="font-display block text-lg font-bold tracking-tight text-ghost-white">
                {BRAND.name}
              </span>
              {orgName && (
                <span className="block truncate text-[10px] text-on-surface-variant">{orgName}</span>
              )}
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {NAV.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </nav>

        <div className="space-y-2 border-t border-glass-border-subtle p-3">
          {isPlatformAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-xl bg-violet-500/15 px-3 py-2.5 text-sm font-semibold text-vivid-violet"
            >
              <MaterialIcon name="admin_panel_settings" />
              Platform panel
            </Link>
          )}
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="nav-item"
          >
            <MaterialIcon name="open_in_new" className="text-[20px]" />
            View site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="nav-item w-full text-left disabled:opacity-50"
          >
            <MaterialIcon name="logout" className="text-[20px]" />
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-glass-border-subtle bg-obsidian/90 px-4 backdrop-blur-xl lg:left-64 lg:w-[calc(100%-16rem)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container lg:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <MaterialIcon name="menu" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
            <MaterialIcon name="smart_toy" filled className="text-primary" />
            <span className="font-display font-bold">{BRAND.name}</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container transition-colors hover:bg-surface-container-high"
            aria-label="Notifications"
          >
            <MaterialIcon name="notifications" className="text-on-surface-variant text-[20px]" />
          </button>
          <Link
            href="/dashboard/settings"
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-primary/40 bg-surface-container text-xs font-bold"
            title={userEmail || "Account"}
          >
            {userInitials(userEmail)}
          </Link>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="sidebar-shell absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col shadow-2xl">
            <div className="flex items-center justify-between border-b border-glass-border-subtle px-5 py-5">
              <div>
                <p className="font-semibold text-ghost-white">{orgName || BRAND.name}</p>
                <p className="text-xs text-on-surface-variant">{userEmail}</p>
              </div>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close">
                <MaterialIcon name="close" />
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
              {NAV.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={isActive(item.href)}
                  onClick={() => setMenuOpen(false)}
                />
              ))}
            </nav>
            <div className="border-t border-glass-border-subtle p-3">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="nav-item w-full text-left disabled:opacity-50"
              >
                {loggingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-col pt-16 lg:ml-64">
        <div className="flex-1 pb-24 lg:pb-8">{children}</div>
        <DashboardFooter />
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 z-50 flex h-20 w-full items-center justify-around border-t border-glass-border-subtle bg-obsidian/95 px-4 backdrop-blur-2xl lg:hidden">
        {MOBILE_NAV.slice(0, 2).map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${active ? "text-primary" : "text-on-surface-variant"}`}
            >
              <MaterialIcon name={item.icon} filled={active} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
        <div className="relative -top-8">
          <Link
            href="/dashboard/agents/new"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-electric-cyan text-ghost-white shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
            aria-label="Create agent"
          >
            <MaterialIcon name="add" className="text-3xl" />
          </Link>
        </div>
        {MOBILE_NAV.slice(2).map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${active ? "text-primary" : "text-on-surface-variant"}`}
            >
              <MaterialIcon name={item.icon} filled={active} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
