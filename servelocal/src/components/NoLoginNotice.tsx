type NoLoginNoticeProps = {
  variant?: "bar" | "pill" | "inline";
  className?: string;
};

const messages = {
  bar: "No account needed — browse pros, call direct, post jobs & reviews instantly",
  pill: "No login required",
  inline: "No sign-up needed. Just fill the form and go.",
};

export function NoLoginNotice({ variant = "pill", className = "" }: NoLoginNoticeProps) {
  if (variant === "bar") {
    return (
      <div
        className={`border-b border-teal-200/70 bg-gradient-to-r from-teal-50/90 via-white to-amber-50/80 px-4 py-2 text-center text-xs font-medium text-teal-800 sm:text-sm ${className}`}
        role="status"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[10px] text-white">
            ✓
          </span>
          {messages.bar}
        </span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <p className={`flex items-start gap-2 rounded-xl border border-teal-200/60 bg-teal-50/50 px-3 py-2.5 text-sm text-teal-800 ${className}`}>
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white">
          ✓
        </span>
        <span>{messages.inline}</span>
      </p>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-teal-200/80 bg-teal-50/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal-700 sm:text-xs ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
      {messages.pill}
    </span>
  );
}
