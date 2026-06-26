"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ratelocal-theme";

type Theme = "dark" | "light";

function systemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Apply the resolved theme to the document: drives the design-system `.dark`
 *  tokens and keeps the legacy `.public-shell` data-theme in sync. */
function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.querySelector(".public-shell")?.setAttribute("data-theme", theme);
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    // Default to the user's system preference when no explicit choice is stored.
    const initial = stored ?? systemTheme();
    setTheme(initial);
    applyTheme(initial);

    // Follow system changes while the user has not made an explicit choice.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      const next: Theme = event.matches ? "dark" : "light";
      setTheme(next);
      applyTheme(next);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-surface/50",
          className
        )}
        aria-label="Toggle theme"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-surface/50 text-text transition hover:border-primary/50 hover:text-primary",
        className
      )}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var t=s||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var d=document.documentElement;d.classList.toggle('dark',t==='dark');d.classList.add('public-theme-ready');}catch(e){}})();`,
      }}
    />
  );
}
