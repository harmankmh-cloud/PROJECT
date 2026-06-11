"use client";

import { useSyncExternalStore } from "react";

type ClientOnlyProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

function subscribe() {
  return () => {};
}

/** Renders children only after mount — avoids Framer Motion / window SSR hydration mismatches. */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
