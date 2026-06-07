import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in to your ${BRAND.name} dashboard to manage AI phone agents, calls, and integrations.`,
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return <LoginForm initialError={params.error ?? ""} />;
}
