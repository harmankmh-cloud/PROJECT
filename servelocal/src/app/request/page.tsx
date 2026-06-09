import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/layout/MarketingPageShell";
import { RequestWizard } from "@/components/request/RequestWizard";
import { FadeUp } from "@/components/motion/FadeUp";
import { getServiceCategories } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = pageMetadata({
  title: "Get Free Quotes from Local Pros",
  description:
    "Post your job in 6 easy steps. Get matched with up to 5 verified Canadian contractors — fast, free, no stress.",
  path: "/request",
});

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{
    city?: string;
    category?: string;
    pro?: string;
    name?: string;
    email?: string;
  }>;
}) {
  const params = await searchParams;
  const categories = await getServiceCategories();

  let defaultEmail = params.email ?? "";
  let defaultName = params.name ?? "";
  let isLoggedIn = false;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        isLoggedIn = true;
        defaultEmail = defaultEmail || (user.email ?? "");
        const meta = user.user_metadata as { full_name?: string; name?: string } | undefined;
        defaultName = defaultName || meta?.full_name || meta?.name || "";
      }
    }
  }

  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
        <FadeUp>
          <h1 className="font-display text-3xl font-black text-foreground sm:text-4xl">
            Get free quotes
          </h1>
          <p className="mt-2 text-muted">
            We&apos;ll match your job with up to 5 verified local pros. Takes under 3 minutes.
          </p>
          {!isLoggedIn && (
            <p className="mt-3 text-sm text-muted">
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Create a free account
              </Link>{" "}
              to track your requests — or continue as a guest.
            </p>
          )}
        </FadeUp>
        <div className="mt-10 rounded-[14px] border border-border bg-surface p-6 sm:p-8">
          <RequestWizard
            categories={categories}
            defaultCity={params.city}
            defaultCategory={params.category}
            defaultPro={params.pro}
            defaultName={defaultName}
            defaultEmail={defaultEmail}
          />
        </div>
      </div>
    </MarketingPageShell>
  );
}
