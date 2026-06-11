"use client";

import { useEffect } from "react";

/** Registers a lightweight service worker for dashboard install / offline shell. */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}
