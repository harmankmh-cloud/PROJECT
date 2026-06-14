import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCodeErrorRecovery } from "@/components/auth/AuthCodeErrorRecovery";
import {
  AUTH_CODE_ERROR_COPY,
  type AuthCodeErrorReason,
} from "@/lib/auth/confirm-errors";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Confirmation Link Problem",
    description: "Your email confirmation link could not be verified.",
    path: "/auth/auth-code-error",
  }),
  robots: { index: false, follow: false },
};

const VALID_REASONS = new Set<AuthCodeErrorReason>([
  "link_used",
  "verification_failed",
  "invalid_link",
  "auth_failed",
  "not_configured",
]);

function parseReason(raw: string | undefined): AuthCodeErrorReason {
  if (raw && VALID_REASONS.has(raw as AuthCodeErrorReason)) {
    return raw as AuthCodeErrorReason;
  }
  return "verification_failed";
}

export default async function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; email?: string }>;
}) {
  const params = await searchParams;
  const reason = parseReason(params.reason);
  const copy = AUTH_CODE_ERROR_COPY[reason];

  return (
    <AuthLayout title={copy.title} subtitle="Email confirmation">
      <AuthCodeErrorRecovery reason={reason} initialEmail={params.email} />
      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/" className="hover:text-primary hover:underline">
          ← Back to ServeLocal
        </Link>
      </p>
    </AuthLayout>
  );
}
