import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupFormNew } from "@/components/auth/SignupFormNew";
import { AUTH } from "@/content/copy";

export default function SignupPage() {
  return (
    <AuthLayout title={AUTH.signup.title} subtext={AUTH.signup.subtext}>
      <SignupFormNew />
    </AuthLayout>
  );
}
