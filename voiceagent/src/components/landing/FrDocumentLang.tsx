"use client";

import { useEffect } from "react";

/** Sets document lang for /fr routes (root layout html stays en for the rest of the site). */
export function FrDocumentLang() {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = "fr";
    return () => {
      document.documentElement.lang = previous;
    };
  }, []);

  return null;
}
