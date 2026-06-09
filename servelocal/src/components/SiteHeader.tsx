import Link from "next/link";
import { SERVE_LOCAL } from "@/lib/constants";
import { SiteAuthNav } from "@/components/SiteAuthNav";
import { createClient } from "@/lib/supabase/server";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function SiteHeader({ compact }: { compact?: boolean }) {
  let accountHref: string | null = null;
  let accountLabel: string | null = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        if (isPlatformAdmin(user.email)) {
          accountHref = "/admin";
          accountLabel = "Admin";
        } else {
          accountHref = "/dashboard";
          accountLabel = "My account";
        }
      }
    }
  }

  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3.5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-sm font-bold text-white shadow-[0_2px_8px_-2px_rgba(13,148,136,0.35)] ring-1 ring-teal-600/20">
            S
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-brand-950 transition-colors group-hover:text-teal-600">
            {SERVE_LOCAL.name}
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <SiteAuthNav compact={compact} accountHref={accountHref} accountLabel={accountLabel} />
          <Link href="/join" className="btn-ghost hidden px-4 py-2 text-sm sm:inline-flex">
            List business
          </Link>
          <Link href="/request" className="btn-teal px-4 py-2 text-sm">
            Get quotes
          </Link>
        </nav>
      </div>
    </header>
  );
}
