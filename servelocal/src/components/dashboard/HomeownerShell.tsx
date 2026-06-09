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
  Settings,
  Star,
} from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";
import { MobileTabBar } from "@/components/dashboard/MobileTabBar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard/jobs", label: "My Jobs", icon: Briefcase },
  { href: "/dashboard/browse", label: "Browse Pros", icon: LayoutGrid },
  { href: "/dashboard/quotes", label: "Quotes", icon: FileText },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/saved", label: "Saved Pros", icon: Bookmark },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function HomeownerShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-[240px] shrink-0 flex-col border-r border-border bg-surface p-4 md:flex">
        <Link href="/" className="font-display mb-8 text-lg font-black text-foreground">
          ServeLocal<span className="text-primary">.</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
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
                {item.label}
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
            <ThemeToggle />
            <div className="md:hidden">
              <SignOutButton />
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>

      <MobileTabBar tabs={NAV.slice(0, 5)} />
    </div>
  );
}
