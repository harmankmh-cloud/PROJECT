import type { Metadata } from "next";
import { IndustryPageTemplate } from "@/components/marketing/IndustryPageTemplate";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";

const page = INDUSTRY_PAGES.dental;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/dental" },
};

export default function DentalPage() {
  return <IndustryPageTemplate slug="dental" />;
}
