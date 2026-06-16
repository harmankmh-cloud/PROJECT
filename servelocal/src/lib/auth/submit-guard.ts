import { useCallback, useRef } from "react";

/** Minimum gap between submit attempts (ms). */
export const SUBMIT_DEBOUNCE_MS = 800;

/**
 * Prevents double-click / effect-loop signup spam.
 * Returns "skipped" when a call is already in flight or inside the debounce window.
 */
export function useSubmitGuard(minIntervalMs = SUBMIT_DEBOUNCE_MS) {
  const pendingRef = useRef(false);
  const lastAtRef = useRef(0);

  return useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | "skipped"> => {
      const now = Date.now();
      if (pendingRef.current || now - lastAtRef.current < minIntervalMs) {
        return "skipped";
      }
      pendingRef.current = true;
      lastAtRef.current = now;
      try {
        return await fn();
      } finally {
        pendingRef.current = false;
      }
    },
    [minIntervalMs]
  );
}
