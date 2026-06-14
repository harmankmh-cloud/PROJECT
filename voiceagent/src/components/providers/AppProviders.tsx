"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { useState } from "react";
import { MaterialSymbolsLoader } from "@/components/dashboard/MaterialSymbolsLoader";
import { ToastProvider } from "@/components/providers/ToastProvider";

/** Dashboard-only providers — keeps react-query and framer-motion off marketing pages. */
export function DashboardProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <MotionConfig reducedMotion="user">
          <MaterialSymbolsLoader />
          {children}
        </MotionConfig>
      </ToastProvider>
    </QueryClientProvider>
  );
}
