"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  ChevronDown,
  Code,
  Contact,
  CreditCard,
  FlaskConical,
  GitBranch,
  HelpCircle,
  History,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  MessageSquare,
  Phone,
  PhoneCall,
  Radio,
  Rocket,
  Settings,
  Shield,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import { SignOutButton } from "@/components/SignOutButton";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { useUiStore } from "@/stores/ui";
import { BRAND } from "@/lib/brand";

const PRIMARY_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, demoHref: "/demo" },
  { href: "/dashboard/calls", label: "Call Logs", icon: PhoneCall, demoHref: "/demo#recent-calls" },
  { href: "/dashboard/tasks", label: "Tasks", icon: ListChecks, demoHref: "/demo" },
  { href: "/dashboard/appointments", label: "Appointments", icon: Calendar, demoHref: "/demo#appointments" },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, demoHref: "/demo#messages" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, demoHref: "/signup" },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard, demoHref: "/signup?plan=growth" },
] as const;

const MORE_NAV = [
  { href: "/dashboard/live", label: "Live calls", icon: Radio },
  { href: "/dashboard/setup", label: "Setup wizard", icon: Rocket },
  { href: "/dashboard/agents", label: "Agents", icon: Sparkles },
  { href: "/dashboard/phone-numbers", label: "Phone Numbers", icon: Phone },
  { href: "/dashboard/knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/dashboard/flows", label: "Flows", icon: Workflow },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/dashboard/contacts", label: "Contacts", icon: Contact },
  { href: "/dashboard/channels", label: "Channels", icon: Radio },
  { href: "/dashboard/sandbox", label: "Sandbox", icon: FlaskConical },
  { href: "/dashboard/integrations", label: "Integrations", icon: GitBranch },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/developer", label: "Developer", icon: Code },
  { href: "/dashboard/compliance", label: "Compliance", icon: Shield },
  { href: "/dashboard/audit", label: "Audit", icon: History },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/help", label: "Help", icon: HelpCircle },
] as const;

function userInitials(email?: string) {
  if (!email) return "?";
  return (email.split("@")[0] || "").slice(0, 2).toUpperCase();
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "nav-item-active bg-violet-500/10 text-text shadow-[inset_3px_0_0_var(--color-primary)]"
          : "nav-item hover:bg-white/5"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

export function DashboardShell({
  orgName,
  userEmail,
  isPlatformAdmin,
  children,
  isDemo = false,
}: {
  orgName?: string;
  userEmail?: string;
  isPlatformAdmin?: boolean;
  children: React.ReactNode;
  isDemo?: boolean;
}) {
  const pathname = usePathname();
  const menuOpen = useUiStore((s) => s.sidebarOpen);
  const setMenuOpen = useUiStore((s) => s.setSidebarOpen);
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const sidebar = (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <Sparkles className="h-5 w-5 text-primary-glow" />
        <div className="min-w-0">
          <span className="font-display block truncate text-sm font-bold text-text">{BRAND.name}</span>
          {orgName && <span className="block truncate text-[10px] text-muted">{orgName}</span>}
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {PRIMARY_NAV.map((item) => (
          <NavItem
            key={item.href}
            href={isDemo ? item.demoHref : item.href}
            label={item.label}
            icon={item.icon}
            active={!isDemo && isActive(item.href)}
            onClick={() => setMenuOpen(false)}
          />
        ))}

        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className="nav-item mt-2 flex w-full items-center justify-between"
        >
          <span className="flex items-center gap-3">
            <ChevronDown className={`h-4 w-4 transition ${moreOpen ? "rotate-180" : ""}`} />
            More
          </span>
        </button>
        {moreOpen &&
          MORE_NAV.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={isActive(item.href)}
              onClick={() => setMenuOpen(false)}
            />
          ))}
      </nav>

      <div className="space-y-2 border-t border-border p-3">
        <div className="rounded-lg border border-primary/20 bg-primary/10 p-3">
          <p className="text-xs font-semibold text-text">Upgrade to Pro</p>
          <p className="mt-1 text-[10px] text-muted">900 min + calendar sync</p>
          <Link
            href={isDemo ? "/signup?plan=pro" : "/dashboard/billing"}
            className="mt-2 block text-xs font-medium text-primary-glow hover:underline"
          >
            View plans →
          </Link>
        </div>
        {isPlatformAdmin && (
          <Link href="/admin" className="nav-item text-primary-glow">
            Platform panel
          </Link>
        )}
        {!isDemo && <SignOutButton className="nav-item w-full text-left" />}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-bg text-text">
      <aside className="sidebar-shell fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col lg:flex">
        {sidebar}
      </aside>

      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-bg/80 px-4 backdrop-blur-xl lg:left-60 lg:w-[calc(100%-15rem)]">
        <button
          type="button"
          className="rounded-lg border border-border p-2 lg:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <LayoutDashboard className="h-5 w-5" />
        </button>
        <p className="hidden text-sm text-muted lg:block">
          {orgName || BRAND.name}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-lg p-2 text-muted hover:bg-white/5" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          {!isDemo && (
            <Link
              href="/dashboard/settings"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-surface text-xs font-bold"
            >
              {userInitials(userEmail)}
            </Link>
          )}
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="sidebar-shell absolute left-0 top-0 flex h-full w-72 flex-col shadow-2xl">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-col pt-16 lg:ml-60">
        <div className="flex-1">{children}</div>
        {!isDemo && <DashboardFooter />}
      </div>
    </div>
  );
}
