import type { Metadata } from "next";
import { IndustryPageTemplate } from "@/components/marketing/IndustryPageTemplate";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";

const page = INDUSTRY_PAGES.hvac;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/hvac" },
};

export default function HvacPage() {
  return <IndustryPageTemplate slug="hvac" />;
}
