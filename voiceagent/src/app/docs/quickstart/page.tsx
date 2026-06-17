import { marketingMetadata } from "@/lib/seo/marketing-metadata";
import { DocsSection, DocsShell } from "@/components/docs/DocsShell";
import { DOCS_QUICKSTART } from "@/lib/docs-content";

export const metadata = marketingMetadata({
  title: "Quickstart",
  description: "Connect telephony and go live with GreetQ in four steps.",
  path: "/docs/quickstart",
});

export default function DocsQuickstartPage() {
  return (
    <DocsShell title={DOCS_QUICKSTART.title}>
      {DOCS_QUICKSTART.steps.map((step) => (
        <DocsSection
          key={step.heading}
          heading={step.heading}
          body={step.body}
          code={"code" in step ? step.code : undefined}
        />
      ))}
    </DocsShell>
  );
}
