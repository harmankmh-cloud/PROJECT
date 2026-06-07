import type { Metadata } from "next";
import { SignupForm } from "@/components/SignupForm";
import { BRAND } from "@/lib/brand";
import type { PlanKey } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Create account",
  description: `Start your ${BRAND.name} free trial. Set up AI phone agents for inbound calls, booking, and warm transfer.`,
  alternates: { canonical: "/signup" },
};

function parsePlan(plan?: string): PlanKey | null {
  if (plan === "starter" || plan === "growth" || plan === "pro" || plan === "enterprise") return plan;
  return null;
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const params = await searchParams;
  return <SignupForm initialPlan={parsePlan(params.plan)} />;
}
