import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { BRAND } from "@/lib/brand";

export const metadata = marketingMetadata({
  title: "Onboarding",
  description: `Set up your ${BRAND.name} AI phone agent — greeting, knowledge base, and telephony.`,
  path: "/onboarding",
  robots: { index: false, follow: false },
});

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
