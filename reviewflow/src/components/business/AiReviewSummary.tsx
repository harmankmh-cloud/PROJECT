import { Sparkles } from "lucide-react";
import { FadeInSection } from "@/components/ui/FadeInSection";

export function AiReviewSummary({
  summary,
  tags,
}: {
  summary: string | null | undefined;
  tags: string[] | null | undefined;
}) {
  if (!summary) return null;

  return (
    <FadeInSection className="rounded-xl border border-star/20 bg-star/5 p-5">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-star">
        <Sparkles className="h-4 w-4" />
        AI Review Summary
      </div>
      <p className="text-sm leading-relaxed text-text">{summary}</p>
      {tags && tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </FadeInSection>
  );
}
