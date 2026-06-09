"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Star,
  User,
} from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";
import { MobileTabBar } from "@/components/dashboard/MobileTabBar";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard/pro", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/pro/leads", label: "Job Leads", icon: ClipboardList },
  { href: "/dashboard/pro/profile", label: "My Profile", icon: User },
  { href: "/dashboard/pro/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/pro/subscription", label: "Subscription", icon: CreditCard },
  { href: "/dashboard/pro/reviews", label: "Reviews", icon: Star },
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
    <div className="dashboard-main flex min-h-screen">
      <aside className="sidebar-shell hidden w-[220px] shrink-0 flex-col p-4 md:flex">
        <Link href="/" className="font-display mb-2 text-lg font-black text-white">
          ServeLocal<span className="text-primary">.</span>
        </Link>
        <p className="mb-6 truncate text-xs text-slate-500">Pro · {businessName ?? "Your business"}</p>
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
                  "flex items-center gap-3 rounded-lg border-l-4 px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "border-l-primary bg-slate-800 text-primary"
                    : "border-l-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-50"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/dashboard/jobs" className="mb-3 text-xs text-slate-500 hover:text-primary">
          ← Homeowner view
        </Link>
        <SignOutButton />
      </aside>

      <main className="flex-1 px-4 py-6 pb-20 md:px-8 md:pb-6">{children}</main>
      <MobileTabBar tabs={NAV.slice(0, 5)} />
    </div>
  );
}
