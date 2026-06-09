"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type Locale, type TranslationKey, t } from "@/lib/i18n/translations";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  tr: (key: TranslationKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem("servelocal-locale") as Locale | null;
    if (stored === "en" || stored === "fr") setLocaleState(stored);
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    localStorage.setItem("servelocal-locale", next);
    document.documentElement.lang = next === "fr" ? "fr-CA" : "en-CA";
  }

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        tr: (key) => t(locale, key),
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: "en" as Locale,
      setLocale: () => {},
      tr: (key: TranslationKey) => t("en", key),
    };
  }
  return ctx;
}
