import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { BRAND } from "@/lib/brand";

export const metadata = marketingMetadata({
  title: "Set new password",
  description: `Choose a new password for your ${BRAND.name} account.`,
  path: "/reset-password",
  robots: { index: false, follow: false },
});

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
