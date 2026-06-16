import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { createClient } from "@/lib/supabase/server";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { SERVE_LOCAL } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  const supabase = await createClient();
  if (!supabase) {
    redirect("/login");
  }

  const user = await getServerAuthUser();

  if (!user) redirect("/login");
  if (!isPlatformAdmin(user.email)) redirect("/login?error=unauthorized");

  return (
    <div className="flex min-h-screen">
      <aside className="sidebar-shell hidden w-56 shrink-0 flex-col p-4 sm:flex">
        <Link href="/admin" className="font-display text-lg text-white">
          {SERVE_LOCAL.name}
        </Link>
        <p className="mt-1 text-xs text-white/50">Admin</p>
        <nav className="mt-8 space-y-1">
          <Link href="/admin#listings" className="nav-item">
            Listings
          </Link>
          <Link href="/admin#requests" className="nav-item">
            Job requests
          </Link>
          <Link href="/admin/settings" className="nav-item">
            Settings
          </Link>
          <Link href="/admin/users" className="nav-item">
            Users
          </Link>
          <Link href="/dashboard" className="nav-item">
            My account
          </Link>
          <Link href="/" className="nav-item" target="_blank">
            View site ↗
          </Link>
        </nav>
        <div className="mt-auto pt-6">
          <SignOutButton className="nav-item w-full text-left" />
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-end gap-3 border-b border-slate-200/70 bg-white/80 px-4 py-2 sm:hidden">
          <Link href="/" className="text-sm text-teal-600">
            View site
          </Link>
          <SignOutButton className="text-sm font-medium text-slate-600" />
        </div>
        {children}
      </div>
    </div>
  );
}
