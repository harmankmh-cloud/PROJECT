"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import type { Locale } from "@/lib/i18n/translations";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex gap-1 rounded-full border border-border p-0.5 text-xs">
      {(["en", "fr"] as Locale[]).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLocale(lang)}
          className={`rounded-full px-2.5 py-1 font-semibold uppercase transition ${
            locale === lang ? "bg-primary text-white" : "text-muted hover:text-foreground"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
