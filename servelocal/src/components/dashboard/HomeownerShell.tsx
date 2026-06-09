"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Briefcase,
  LayoutGrid,
  MessageSquare,
  Settings,
} from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";
import { MobileTabBar } from "@/components/dashboard/MobileTabBar";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard/jobs", label: "My Jobs", icon: Briefcase },
  { href: "/dashboard/browse", label: "Browse Pros", icon: LayoutGrid },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/saved", label: "Saved Pros", icon: Bookmark },
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
    <div className="dashboard-main flex min-h-screen">
      <aside className="sidebar-shell hidden w-[220px] shrink-0 flex-col p-4 md:flex">
        <Link href="/" className="font-display mb-8 text-lg font-black text-white">
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
        <p className="truncate text-xs text-slate-500">{email}</p>
        <SignOutButton />
      </aside>

      <div className="flex flex-1 flex-col pb-20 md:pb-0">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 md:px-8">
          <Link href="/request" className="btn-orange text-sm">
            Post a New Job
          </Link>
          <div className="md:hidden">
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>

      <MobileTabBar tabs={[...NAV]} />
    </div>
  );
}
