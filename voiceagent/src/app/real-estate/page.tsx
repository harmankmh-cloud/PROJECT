import type { Metadata } from "next";
import { IndustryPageTemplate } from "@/components/marketing/IndustryPageTemplate";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";

const page = INDUSTRY_PAGES["real-estate"];

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/real-estate" },
};

export default function RealEstatePage() {
  return <IndustryPageTemplate slug="real-estate" />;
}
