"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/agents", label: "Agents" },
  { href: "/dashboard/calls", label: "Calls" },
  { href: "/dashboard/flows", label: "Flows" },
  { href: "/dashboard/campaigns", label: "Campaigns" },
  { href: "/dashboard/integrations", label: "Integrations" },
  { href: "/dashboard/compliance", label: "Compliance" },
  { href: "/dashboard/channels", label: "Channels" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r border-slate-200 bg-white p-4">
        <div className="mb-8">
          <p className="text-lg font-bold text-brand-900">{BRAND.name}</p>
          <p className="text-xs text-slate-500">Enterprise Voice AI</p>
        </div>
        <nav className="space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? "bg-brand-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
