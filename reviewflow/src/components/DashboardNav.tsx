"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/dashboard/prompts", label: "Prompts" },
];

export function DashboardNav({ businessName, reviewSlug }: { businessName?: string; reviewSlug?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="min-w-0">
          <Link href="/dashboard" className="text-sm font-semibold text-emerald-700">
            ReviewFlow
          </Link>
          {businessName && (
            <p className="truncate text-sm text-zinc-500">{businessName}</p>
          )}
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-3 py-2 text-sm font-medium ${
                pathname === link.href
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {reviewSlug && (
            <Link
              href={`/r/${reviewSlug}`}
              target="_blank"
              className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
            >
              Preview page
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-60"
          >
            {loggingOut ? "Logging out..." : "Log out"}
          </button>
        </nav>

        <button
          type="button"
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-200 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700"
              >
                {link.label}
              </Link>
            ))}
            {reviewSlug && (
              <Link
                href={`/r/${reviewSlug}`}
                target="_blank"
                className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700"
              >
                Preview page
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl px-3 py-2 text-left text-sm font-medium text-zinc-700"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
