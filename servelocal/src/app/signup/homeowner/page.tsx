import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { HomeownerSignupForm } from "@/components/auth/HomeownerSignupForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Homeowner Sign Up",
  description: "Create a free ServeLocal account to post jobs and track local pro responses.",
  path: "/signup/homeowner",
});

export default function HomeownerSignupPage() {
  return (
    <AuthLayout title="I need a pro" subtitle="Free account for BC homeowners.">
      <HomeownerSignupForm />
    </AuthLayout>
  );
}
