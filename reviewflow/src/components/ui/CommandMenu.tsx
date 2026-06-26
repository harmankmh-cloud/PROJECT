"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  onSelect: () => void;
};

/**
 * Global cmd+k command menu. Opens on ⌘K / Ctrl+K, filters items by label,
 * and is keyboard navigable. Styled with the RateLocal design tokens
 * (surface-elevated, rounded-2xl, border, shadow-2xl).
 */
export function CommandMenu({ items }: { items: CommandItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || item.hint?.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Keep the active index within bounds without a synchronous effect.
  const activeIndex = Math.min(active, Math.max(filtered.length - 1, 0));

  const onQueryChange = (value: string) => {
    setQuery(value);
    setActive(0);
  };

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
    }
    setActive(0);
  };

  const run = (item: CommandItem) => {
    item.onSelect();
    setOpen(false);
    setQuery("");
  };

  const onListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(Math.min(activeIndex + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (event.key === "Enter" && filtered[activeIndex]) {
      event.preventDefault();
      run(filtered[activeIndex]);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-2xl focus:outline-none"
          onKeyDown={onListKeyDown}
        >
          <DialogPrimitive.Title className="sr-only">Command menu</DialogPrimitive.Title>
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="h-4 w-4 text-text-tertiary" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search…"
              aria-label="Search commands"
              className="h-12 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
            />
            <kbd className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary">
              ESC
            </kbd>
          </div>

          <ul className="max-h-72 overflow-y-auto p-2" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-text-secondary">
                No results found.
              </li>
            ) : (
              filtered.map((item, index) => (
                <li key={item.id} role="option" aria-selected={index === activeIndex}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onClick={() => run(item)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition",
                      index === activeIndex
                        ? "bg-brand-muted text-brand"
                        : "text-text-primary hover:bg-surface"
                    )}
                  >
                    <span>{item.label}</span>
                    {item.hint ? (
                      <span className="text-xs text-text-tertiary">{item.hint}</span>
                    ) : null}
                  </button>
                </li>
              ))
            )}
          </ul>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
