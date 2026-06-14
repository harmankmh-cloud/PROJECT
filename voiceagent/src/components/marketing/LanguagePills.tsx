import Link from "next/link";

const LANGUAGES = [
  { name: "English", status: "live" },
  { name: "Spanish", status: "beta" },
  { name: "French", status: "roadmap" },
] as const;

export function LanguagePills() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {LANGUAGES.map((lang) => (
        <Link
          key={lang.name}
          href="/languages"
          className="rounded-full border border-border px-3 py-1 text-xs text-muted transition hover:border-primary/40 hover:text-text"
        >
          {lang.name}
          {lang.status === "beta" && (
            <span className="ml-1 text-accent">beta</span>
          )}
          {lang.status === "roadmap" && (
            <span className="ml-1 text-muted/60">soon</span>
          )}
        </Link>
      ))}
    </div>
  );
}
