"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Star,
  TrendingUp,
  Users,
  Send,
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { BRAND } from "@/lib/brand";

const links = [
  { href: "/business/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/business/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/business/dashboard/reputation", label: "Reputation Score", icon: TrendingUp },
  { href: "/business/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/business/dashboard/respond", label: "Respond", icon: MessageSquare },
  { href: "/business/dashboard/requests", label: "Request Reviews", icon: Send },
  { href: "/business/dashboard/competitors", label: "Competitors", icon: Users },
  { href: "/business/dashboard/profile", label: "Profile", icon: Settings },
  { href: "/business/dashboard/billing", label: "Billing", icon: CreditCard },
];

export function BusinessDashboardShell({
  businessName,
  children,
}: {
  businessName?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/login");
  }

  const sidebar = (
    <nav className="flex h-full w-56 flex-col border-r border-border bg-surface">
      <div className="border-b border-border p-4">
        <Link href="/" className="font-display font-bold text-text">{BRAND.name}</Link>
        {businessName && <p className="mt-1 truncate text-xs text-muted">{businessName}</p>}
      </div>
      <div className="flex-1 space-y-0.5 p-2">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                active ? "bg-primary/10 font-semibold text-primary" : "text-muted hover:bg-bg hover:text-text"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
      <button type="button" onClick={logout} className="m-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:text-text">
        <LogOut className="h-4 w-4" /> Log out
      </button>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <aside className="hidden md:block">{sidebar}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-56">{sidebar}</div>
        </div>
      )}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center border-b border-border px-4 py-3 md:hidden">
          <button type="button" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></button>
          <span className="ml-3 font-display font-bold">{BRAND.name}</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
