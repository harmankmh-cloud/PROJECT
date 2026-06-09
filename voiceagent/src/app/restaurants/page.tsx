import type { Metadata } from "next";
import { IndustryPageTemplate } from "@/components/marketing/IndustryPageTemplate";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";

const page = INDUSTRY_PAGES.restaurants;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/restaurants" },
};

export default function RestaurantsPage() {
  return <IndustryPageTemplate slug="restaurants" />;
}
