import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { IndustryPageTemplate } from "@/components/marketing/IndustryPageTemplate";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";

const page = INDUSTRY_PAGES["real-estate"];

export const metadata = marketingMetadata({
  title: page.title,
  description: page.description,
  path: "/real-estate",
});

export default function RealEstatePage() {
  return <IndustryPageTemplate slug="real-estate" />;
}
