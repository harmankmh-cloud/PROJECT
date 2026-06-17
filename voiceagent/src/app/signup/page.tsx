import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { SignupForm } from "@/components/SignupForm";
import { BRAND } from "@/lib/brand";
import type { PlanKey } from "@/lib/plans";

export const metadata = marketingMetadata({
  title: "Create account",
  description: `Create your ${BRAND.name} account — 30 free minutes and sandbox testing, no card required. Go live with a 14-day trial when you're ready.`,
  path: "/signup",
});


function parsePlan(plan?: string): PlanKey | null {
  if (plan === "starter" || plan === "growth" || plan === "pro" || plan === "enterprise") return plan;
  return null;
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; email?: string; business?: string }>;
}) {
  const params = await searchParams;
  return (
    <SignupForm
      initialPlan={parsePlan(params.plan)}
      initialEmail={params.email?.trim() ?? ""}
      initialBusinessName={params.business?.trim() ?? ""}
    />
  );
}
