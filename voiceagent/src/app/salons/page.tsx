import type { Metadata } from "next";
import { IndustryPageTemplate } from "@/components/marketing/IndustryPageTemplate";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";

const page = INDUSTRY_PAGES.salons;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/salons" },
};

export default function SalonsPage() {
  return <IndustryPageTemplate slug="salons" />;
}
