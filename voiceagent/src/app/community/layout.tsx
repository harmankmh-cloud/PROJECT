import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { BRAND } from "@/lib/brand";

export const metadata = marketingMetadata({
  title: "Community",
  description: `Join the ${BRAND.name} community — product updates, tips, and peer support for Canadian businesses using AI phone agents.`,
  path: "/community",
});

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
