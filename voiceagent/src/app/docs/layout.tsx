import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Developer docs",
  description: `API reference, webhooks, and quickstart for ${BRAND.name} developers.`,
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
