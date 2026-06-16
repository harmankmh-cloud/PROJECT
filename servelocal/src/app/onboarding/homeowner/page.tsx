import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HomeownerOnboardingWizard } from "@/components/homeowner/HomeownerOnboardingWizard";
import { pageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { getServerAuthUser } from "@/lib/supabase/get-server-user";
import { getUserProfile } from "@/lib/user-profiles";
import { resolveUserRole } from "@/lib/auth-routing";

export const metadata: Metadata = pageMetadata({
  title: "Homeowner Setup",
  description: "Set your location and preferences on ServeLocal.",
  path: "/onboarding/homeowner",
});

export default async function HomeownerOnboardingPage() {
  const supabase = await createClient();
  const user = await getServerAuthUser();

  if (!user) redirect("/login");

  const profile = await getUserProfile(user.id);
  const role = await resolveUserRole(user);
  if (profile?.onboarding_completed_at) redirect("/dashboard");
  if (role === "pro") redirect("/dashboard/pro");

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-lg">
        <HomeownerOnboardingWizard defaultCity={profile?.preferred_city_slug ?? undefined} />
      </div>
    </main>
  );
}
