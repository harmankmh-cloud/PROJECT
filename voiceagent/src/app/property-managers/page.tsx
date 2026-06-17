import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { IndustryPageTemplate } from "@/components/marketing/IndustryPageTemplate";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";

const page = INDUSTRY_PAGES["property-managers"];

export const metadata = marketingMetadata({
  title: page.title,
  description: page.description,
  path: "/property-managers",
});

export default function PropertyManagersPage() {
  return <IndustryPageTemplate slug="property-managers" />;
}
