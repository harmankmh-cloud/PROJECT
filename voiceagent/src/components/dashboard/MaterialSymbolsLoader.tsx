"use client";

import { useEffect } from "react";

const HREF =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap";

/** Loads Material Symbols only on dashboard/admin routes — not on the marketing homepage. */
export function MaterialSymbolsLoader() {
  useEffect(() => {
    if (document.getElementById("material-symbols-outlined")) return;
    const link = document.createElement("link");
    link.id = "material-symbols-outlined";
    link.rel = "stylesheet";
    link.href = HREF;
    document.head.appendChild(link);
  }, []);

  return null;
}
