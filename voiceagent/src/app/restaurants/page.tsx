import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { IndustryPageTemplate } from "@/components/marketing/IndustryPageTemplate";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";

const page = INDUSTRY_PAGES.restaurants;

export const metadata = marketingMetadata({
  title: page.title,
  description: page.description,
  path: "/restaurants",
});

export default function RestaurantsPage() {
  return <IndustryPageTemplate slug="restaurants" />;
}
