import type { Metadata } from "next";
import Link from "next/link";
import { ServiceRequestForm } from "@/components/ServiceRequestForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getServiceCategories } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = pageMetadata({
  title: "Get Free Quotes from Local Pros",
  description:
    "Post your job in under 2 minutes. Describe what you need, pick your city and service, and connect with BC trades direct — no lead fees.",
  path: "/request",
});

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string }>;
}) {
  const params = await searchParams;
  const categories = await getServiceCategories();

  let defaultEmail = "";
  let defaultName = "";
  let isLoggedIn = false;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        isLoggedIn = true;
        defaultEmail = user.email ?? "";
        const meta = user.user_metadata as { full_name?: string; name?: string } | undefined;
        defaultName = meta?.full_name || meta?.name || "";
      }
    }
  }

  return (
    <main className="mesh-bg min-h-screen">
      <SiteHeader compact />
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-8">
        <h1 className="font-display text-3xl text-brand-950">Get free quotes</h1>
        <p className="mt-2 text-slate-600">
          Pick your service type, describe your job, and see matching local pros you can call direct. No lead fees.
        </p>
        {!isLoggedIn && (
          <p className="mt-3 text-sm text-slate-500">
            <Link href="/signup" className="font-semibold text-teal-600 hover:underline">
              Create a free account
            </Link>{" "}
            to track your requests — or post as a guest below.
          </p>
        )}
        <div className="mt-8">
          <ServiceRequestForm
            categories={categories}
            defaultCity={params.city}
            defaultCategory={params.category}
            defaultName={defaultName}
            defaultEmail={defaultEmail}
          />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
