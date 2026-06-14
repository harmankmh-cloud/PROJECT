import type { Metadata } from "next";
import { IndustryPageTemplate } from "@/components/marketing/IndustryPageTemplate";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";

const page = INDUSTRY_PAGES["property-managers"];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/property-managers" },
};

export default function PropertyManagersPage() {
  return <IndustryPageTemplate slug="property-managers" />;
}
