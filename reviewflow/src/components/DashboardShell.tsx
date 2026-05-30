"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";

const links = [
  { href: "/dashboard", label: "Command center", icon: "◉" },
  { href: "/dashboard/settings", label: "Business profile", icon: "⚙" },
  { href: "/dashboard/prompts", label: "Review scripts", icon: "✎" },
];

export function DashboardShell({
  businessName,
  reviewSlug,
  children,
}: {
  businessName?: string;
  reviewSlug?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-5">
        <BrandLogo href="/dashboard" light />
        {businessName ? (
          <p className="mt-3 truncate text-sm text-white/60">{businessName}</p>
        ) : (
          <p className="mt-3 text-sm text-white/40">Finish setup to go live</p>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-white/10 text-gold-400"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base opacity-80">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
        {reviewSlug && (
          <Link
            href={`/r/${reviewSlug}`}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            <span className="text-base opacity-80">↗</span>
            Live customer page
          </Link>
        )}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
        >
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream lg:flex">
      <aside className="hidden w-64 shrink-0 bg-brand-950 lg:block">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <aside className="relative h-full w-72 bg-brand-950 shadow-2xl">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#e8e2d9] bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
          <BrandLogo href="/dashboard" size="sm" />
          <button type="button" className="btn-ghost px-3 py-2" onClick={() => setMobileOpen(true)}>
            Menu
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
