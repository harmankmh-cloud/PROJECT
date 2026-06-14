import type { Metadata } from "next";
import { IndustryPageTemplate } from "@/components/marketing/IndustryPageTemplate";
import { INDUSTRY_PAGES } from "@/lib/industry-pages";

const page = INDUSTRY_PAGES.contractors;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/contractors" },
};

export default function ContractorsPage() {
  return <IndustryPageTemplate slug="contractors" />;
}
