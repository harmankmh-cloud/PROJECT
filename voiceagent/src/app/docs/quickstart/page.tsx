import type { Metadata } from "next";
import { DocsSection, DocsShell } from "@/components/docs/DocsShell";
import { DOCS_QUICKSTART } from "@/lib/docs-content";

export const metadata: Metadata = {
  title: "Quickstart",
  description: "Connect telephony and go live with GreetQ in four steps.",
  alternates: { canonical: "/docs/quickstart" },
};

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
