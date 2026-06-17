import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { DocsSection, DocsShell } from "@/components/docs/DocsShell";
import { DOCS_OVERVIEW } from "@/lib/docs-content";
import { BRAND } from "@/lib/brand";

export const metadata = marketingMetadata({
  title: "API overview",
  description: `Authentication, base URL, and rate limits for the ${BRAND.name} API.`,
  path: "/docs",
});


export default function DocsOverviewPage() {
  return (
    <DocsShell title={DOCS_OVERVIEW.title}>
      {DOCS_OVERVIEW.sections.map((section) => (
        <DocsSection
          key={section.heading}
          heading={section.heading}
          body={section.body}
          code={"code" in section ? section.code : undefined}
        />
      ))}
    </DocsShell>
  );
}
