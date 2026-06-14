import type { Metadata } from "next";
import { IndustryPageTemplate } from "@/components/marketing/IndustryPageTemplate";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";

const page = INDUSTRY_PAGES.legal;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  return <IndustryPageTemplate slug="legal" />;
}
