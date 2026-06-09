"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Star,
  User,
} from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";
import { MobileTabBar } from "@/components/dashboard/MobileTabBar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard/pro", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/pro/leads", label: "Leads", icon: ClipboardList },
  { href: "/dashboard/pro/jobs", label: "Jobs", icon: ClipboardList },
  { href: "/dashboard/pro/earnings", label: "Earnings", icon: DollarSign },
  { href: "/dashboard/pro/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/pro/profile", label: "Profile", icon: User },
  { href: "/dashboard/pro/subscription", label: "Subscription", icon: CreditCard },
  { href: "/dashboard/pro/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/pro/settings", label: "Settings", icon: Settings },
] as const;

export function ProShell({
  children,
  businessName,
}: {
  children: React.ReactNode;
  businessName?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-[240px] shrink-0 flex-col border-r border-border bg-surface p-4 md:flex">
        <Link href="/" className="font-display mb-2 text-lg font-black text-foreground">
          ServeLocal<span className="text-primary">.</span>
        </Link>
        <p className="mb-6 truncate text-xs text-muted">Pro · {businessName ?? "Your business"}</p>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard/pro" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-amber-400/15 text-primary"
                    : "text-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/dashboard/jobs" className="mb-3 text-xs text-muted hover:text-primary">
          ← Homeowner view
        </Link>
        <SignOutButton />
      </aside>

      <div className="flex flex-1 flex-col pb-20 md:pb-0">
        <header className="flex items-center justify-end border-b border-border px-4 py-3 md:px-8">
          <ThemeToggle />
        </header>
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
      <MobileTabBar tabs={NAV.slice(0, 5)} />
    </div>
  );
}
