import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ProSignupForm } from "@/components/auth/ProSignupForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contractor Sign Up",
  description: "Create your ServeLocal pro account and set up your BC trades profile.",
  path: "/signup/pro",
});

export default function ProSignupPage() {
  return (
    <AuthLayout title="I am a pro" subtitle="Set up your contractor profile in a few steps.">
      <ProSignupForm />
    </AuthLayout>
  );
}
