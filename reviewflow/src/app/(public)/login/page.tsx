import { PublicAuthLayout } from "@/components/auth/PublicAuthLayout";
import { LoginFormNew } from "@/components/auth/LoginFormNew";
import { AUTH } from "@/content/copy";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const message = params.message ? decodeURIComponent(params.message) : "";

  return (
    <PublicAuthLayout title={AUTH.login.title} subtext={AUTH.login.subtext}>
      <LoginFormNew message={message} />
    </PublicAuthLayout>
  );
}
