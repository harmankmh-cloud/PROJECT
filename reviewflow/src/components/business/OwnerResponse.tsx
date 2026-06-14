import type { OwnerResponse as Response } from "@/lib/types";

export function OwnerResponseBox({ response }: { response: Response }) {
  return (
    <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
        Response from owner
      </p>
      <p className="text-sm text-text">{response.body}</p>
      <p className="mt-2 text-xs text-muted">
        {new Date(response.created_at).toLocaleDateString("en-CA", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
    </div>
  );
}
