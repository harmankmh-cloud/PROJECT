import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!isPlatformAdmin(user.email)) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-cream">
      <header className="site-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <BrandLogo href="/admin" size="sm" />
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="font-medium text-brand-900 hover:text-teal-600">
              Platform
            </Link>
            <Link href="/dashboard" className="text-slate-500 hover:text-teal-600">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
