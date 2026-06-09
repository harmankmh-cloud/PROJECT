import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContractorOnboardingWizard } from "@/components/auth/ContractorOnboardingWizard";
import { getServiceCategories } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/user-profiles";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = pageMetadata({
  title: "Pro Onboarding",
  description: "Set up your ServeLocal contractor profile.",
  path: "/onboarding",
});

export default async function OnboardingPage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  if (!supabase) redirect("/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await getUserProfile(user.id);
  if (profile?.role === "homeowner") redirect("/dashboard");

  const categories = await getServiceCategories();

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="marketing-grid-bg pointer-events-none absolute inset-0 opacity-15" />
      <div className="relative mx-auto max-w-2xl">
        <ContractorOnboardingWizard categories={categories} userEmail={user.email ?? ""} />
      </div>
    </main>
  );
}
