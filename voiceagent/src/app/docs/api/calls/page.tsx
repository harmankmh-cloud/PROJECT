import type { Metadata } from "next";
import { DocsShell } from "@/components/docs/DocsShell";
import { DOCS_CALLS_API } from "@/lib/docs-content";

export const metadata: Metadata = {
  title: "Calls API",
  description: "List recent calls for your organization via GET /api/v1/calls.",
  alternates: { canonical: "/docs/api/calls" },
};

export default function DocsCallsApiPage() {
  const doc = DOCS_CALLS_API;
  return (
    <DocsShell title={doc.title}>
      <section>
        <p className="text-sm text-muted">{doc.description}</p>
        <p className="mt-4 font-mono text-sm text-primary-glow">{doc.endpoint}</p>
      </section>
      <section>
        <h2 className="font-display text-xl text-text">Query parameters</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {doc.params.map((p) => (
            <li key={p.name}>
              <code className="text-text">{p.name}</code> ({p.type}) — default {p.default}, max {p.max}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-display text-xl text-text">Example request</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-bg/80 p-4 text-xs text-text">
          <code>{doc.example}</code>
        </pre>
      </section>
      <section>
        <h2 className="font-display text-xl text-text">Example response</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-bg/80 p-4 text-xs text-text">
          <code>{doc.response}</code>
        </pre>
      </section>
    </DocsShell>
  );
}
