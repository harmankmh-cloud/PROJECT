import type { Metadata } from "next";
import { DocsShell } from "@/components/docs/DocsShell";
import { DOCS_WEBHOOKS } from "@/lib/docs-content";

export const metadata: Metadata = {
  title: "Webhooks",
  description: "Outbound call.completed webhook events from GreetQ.",
  alternates: { canonical: "/docs/webhooks" },
};

export default function DocsWebhooksPage() {
  const doc = DOCS_WEBHOOKS;
  return (
    <DocsShell title={doc.title}>
      <section>
        <p className="text-sm text-muted">{doc.description}</p>
        <p className="mt-4 text-sm">
          Event: <code className="text-primary-glow">{doc.event}</code>
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl text-text">Headers</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {doc.headers.map((h) => (
            <li key={h.name}>
              <code className="text-text">{h.name}</code>: {h.value}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-display text-xl text-text">Payload</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-bg/80 p-4 text-xs text-text">
          <code>{doc.payload}</code>
        </pre>
      </section>
    </DocsShell>
  );
}
