"use client";

import { useEffect } from "react";
import { PageTransition } from "@/components/ui/PageTransition";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem("ratelocal-theme") ?? "dark";
    document.querySelector(".public-shell")?.setAttribute("data-theme", stored);
  }, []);

  return (
    <div className="public-shell" data-theme="dark">
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
