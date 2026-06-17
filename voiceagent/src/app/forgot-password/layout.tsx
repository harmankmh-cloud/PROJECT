import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { BRAND } from "@/lib/brand";

export const metadata = marketingMetadata({
  title: "Reset password",
  description: `Reset your ${BRAND.name} account password. We'll email you a secure link.`,
  path: "/forgot-password",
  robots: { index: false, follow: false },
});

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
