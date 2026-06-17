import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { IndustryPageTemplate } from "@/components/marketing/IndustryPageTemplate";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";

const page = INDUSTRY_PAGES.dental;

export const metadata = marketingMetadata({
  title: page.title,
  description: page.description,
  path: "/dental",
});

export default function DentalPage() {
  return <IndustryPageTemplate slug="dental" />;
}
