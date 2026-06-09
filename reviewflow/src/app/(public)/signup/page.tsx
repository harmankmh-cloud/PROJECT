import { PublicAuthLayout } from "@/components/auth/PublicAuthLayout";
import { SignupFormNew } from "@/components/auth/SignupFormNew";
import { AUTH } from "@/content/copy";

export default function SignupPage() {
  return (
    <PublicAuthLayout title={AUTH.signup.title} subtext={AUTH.signup.subtext}>
      <SignupFormNew />
    </PublicAuthLayout>
  );
}
