"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Briefcase,
  CreditCard,
  FileText,
  LayoutGrid,
  MessageSquare,
  Plus,
  Settings,
  Star,
} from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";
import { MobileTabBar } from "@/components/dashboard/MobileTabBar";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { cn } from "@/lib/utils";

const NAV: {
  href: string;
  label: string;
  icon: typeof Briefcase;
  badgeKey?: "quotes" | "reviews" | "messages";
}[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/jobs", label: "My Jobs", icon: Briefcase },
  { href: "/dashboard/browse", label: "Browse Pros", icon: LayoutGrid },
  { href: "/dashboard/quotes", label: "Quotes", icon: FileText, badgeKey: "quotes" as const },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/saved", label: "Saved Pros", icon: Bookmark },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star, badgeKey: "reviews" as const },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, badgeKey: "messages" as const },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const MOBILE_TABS = [
  { href: "/dashboard", label: "Home", icon: LayoutGrid },
  { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { href: "/request", label: "New Job", icon: Plus },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
];

export function HomeownerShell({
  children,
  email,
  badges = {},
}: {
  children: React.ReactNode;
  email: string;
  badges?: { quotes?: number; reviews?: number; messages?: number };
}) {
  const pathname = usePathname();
  const notificationCount = (badges.messages ?? 0) + (badges.quotes ?? 0) + (badges.reviews ?? 0);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-[240px] shrink-0 flex-col border-r border-border bg-surface p-4 md:flex">
        <Link href="/" className="font-display mb-8 text-lg font-black text-foreground">
          ServeLocal<span className="text-primary">.</span>
        </Link>
        <Link
          href="/request"
          className="mb-4 flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/15"
        >
          <Plus className="h-4 w-4" />
          New Job
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            const badge =
              item.badgeKey === "quotes"
                ? badges.quotes
                : item.badgeKey === "reviews"
                  ? badges.reviews
                  : item.badgeKey === "messages"
                    ? badges.messages
                    : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-amber-400/15 text-primary"
                    : "text-muted hover:bg-surface hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {badge ? (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {badge > 9 ? "9+" : badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <p className="truncate text-xs text-muted">{email}</p>
        <SignOutButton />
      </aside>

      <div className="flex flex-1 flex-col pb-20 md:pb-0">
        <header className="flex items-center justify-between border-b border-border bg-background px-4 py-4 md:px-8">
          <ShimmerButton href="/request" size="sm">
            Post a New Job
          </ShimmerButton>
          <div className="flex items-center gap-2">
            <NotificationBell count={notificationCount} />
            <ThemeToggle />
            <div className="md:hidden">
              <SignOutButton />
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>

      <MobileTabBar tabs={MOBILE_TABS} />
    </div>
  );
}
