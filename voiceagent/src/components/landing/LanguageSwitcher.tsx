"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Compact EN / FR toggle for marketing chrome. */
export function LanguageSwitcher() {
  const pathname = usePathname();
  const onFrench = pathname === "/fr" || pathname.startsWith("/fr/");

  return (
    <div className="flex items-center rounded-lg border border-border/80 bg-surface/50 p-0.5 text-xs font-medium">
      {onFrench ? (
        <>
          <span className="rounded-md bg-violet-600/20 px-2.5 py-1 text-violet-300" lang="fr">
            FR
          </span>
          <Link href="/" className="px-2.5 py-1 text-muted transition hover:text-text" lang="en">
            EN
          </Link>
        </>
      ) : (
        <>
          <span className="rounded-md bg-violet-600/20 px-2.5 py-1 text-violet-300" lang="en">
            EN
          </span>
          <Link href="/fr" className="px-2.5 py-1 text-muted transition hover:text-text" lang="fr">
            FR
          </Link>
        </>
      )}
    </div>
  );
}
