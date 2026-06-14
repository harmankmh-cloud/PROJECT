import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RolePicker } from "@/components/auth/RolePicker";
import { pageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Create Your Account",
    description: "Join ServeLocal BC — homeowners post jobs free; contractors browse leads and contact clients direct.",
    path: "/signup",
  }),
  robots: { index: false, follow: false },
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const params = await searchParams;
  const chooseTypeNotice =
    params.notice === "choose_account_type"
      ? "We could not tell if this account is a homeowner or pro. Pick the right signup path below."
      : null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) redirect("/auth/after-login");
      }
    } catch {
      // Render signup form
    }
  }

  return (
    <AuthLayout
      title="Join ServeLocal"
      subtitle="Choose how you'll use the platform — homeowner or contractor."
    >
      {chooseTypeNotice ? (
        <p className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {chooseTypeNotice}
        </p>
      ) : null}
      <RolePicker />
    </AuthLayout>
  );
}
