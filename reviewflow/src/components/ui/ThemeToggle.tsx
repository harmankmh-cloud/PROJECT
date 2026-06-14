"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ratelocal-theme";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY) as "dark" | "light" | null;
    const initial = stored ?? "dark";
    setTheme(initial);
    document.querySelector(".public-shell")?.setAttribute("data-theme", initial);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.querySelector(".public-shell")?.setAttribute("data-theme", next);
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
        __html: `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'dark';document.documentElement.classList.add('public-theme-ready');}catch(e){}})();`,
      }}
    />
  );
}
