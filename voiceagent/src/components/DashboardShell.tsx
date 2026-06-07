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
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Top nav */}
      <nav className="fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b border-glass-border bg-surface/80 px-5 shadow-sm backdrop-blur-xl md:px-16">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="mr-1 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-low hover:bg-surface-container md:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <MaterialIcon name="menu" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container">
              <MaterialIcon name="smart_toy" filled className="text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tighter">{BRAND.name}</span>
          </Link>
          {orgName && (
            <span className="hidden text-sm text-on-primary-container lg:inline">{orgName}</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-surface-container-low transition-colors hover:bg-surface-container md:flex"
            aria-label="Notifications"
          >
            <MaterialIcon name="notifications" className="text-on-surface-variant" />
          </button>
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-surface-container-low transition-colors hover:bg-surface-container lg:flex"
            aria-label="Open navigation"
            onClick={() => setMenuOpen(true)}
          >
            <MaterialIcon name="apps" className="text-on-surface-variant" />
          </button>
          <Link
            href="/dashboard/settings"
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-electric-blue bg-surface-container text-xs font-bold text-on-surface"
            title={userEmail || "Account"}
          >
            {userInitials(userEmail)}
          </Link>
        </div>
      </nav>

      {/* Nav drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-surface-container-lowest shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/20 px-5 py-5">
              <div>
                <p className="font-semibold text-on-surface">{orgName || BRAND.name}</p>
                <p className="text-xs text-on-primary-container">{userEmail}</p>
              </div>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close">
                <MaterialIcon name="close" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    isActive(item.href)
                      ? "bg-secondary-fixed text-secondary"
                      : "text-slate-text hover:bg-surface-container-low"
                  }`}
                >
                  <MaterialIcon name={item.icon} className="text-[20px]" filled={isActive(item.href)} />
                  {item.label}
                </Link>
              ))}
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-text hover:bg-surface-container-low"
              >
                <MaterialIcon name="open_in_new" className="text-[20px]" />
                View site
              </Link>
            </nav>
            {isPlatformAdmin && (
              <div className="border-t border-outline-variant/20 p-3">
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl bg-electric-blue/10 px-3.5 py-2.5 text-sm font-semibold text-electric-blue"
                >
                  <MaterialIcon name="admin_panel_settings" />
                  Platform panel
                </Link>
              </div>
            )}
            <div className="border-t border-outline-variant/20 p-3">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-slate-text hover:bg-surface-container-low disabled:opacity-50"
              >
                {loggingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-col pt-20">
        <div className="flex-1 pb-24 md:pb-8">{children}</div>
        <DashboardFooter />
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 z-50 flex h-20 w-full items-center justify-around border-t border-glass-border bg-surface/90 px-4 backdrop-blur-2xl md:hidden">
        {MOBILE_NAV.slice(0, 2).map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${active ? "text-secondary" : "text-on-primary-container"}`}
            >
              <MaterialIcon name={item.icon} filled={active} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
        <div className="relative -top-8">
          <Link
            href="/dashboard/agents"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-white shadow-lg shadow-secondary/40 transition-transform hover:scale-105 active:scale-95"
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
              className={`flex flex-col items-center gap-1 ${active ? "text-secondary" : "text-on-primary-container"}`}
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
