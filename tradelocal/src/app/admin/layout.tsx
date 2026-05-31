import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { TRADE_LOCAL } from "@/lib/constants";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!isPlatformAdmin(user.email)) redirect("/login?error=unauthorized");

  return (
    <div className="flex min-h-screen">
      <aside className="sidebar-shell hidden w-56 shrink-0 flex-col p-4 sm:flex">
        <Link href="/admin" className="font-display text-lg text-white">
          {TRADE_LOCAL.name}
        </Link>
        <p className="mt-1 text-xs text-white/50">Admin</p>
        <nav className="mt-8 space-y-1">
          <Link href="/admin" className="nav-item nav-item-active">
            Directory
          </Link>
          <Link href="/" className="nav-item" target="_blank">
            View site ↗
          </Link>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
