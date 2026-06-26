"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  arrow?: boolean;
  onClick?: () => void;
  tone?: "primary" | "light";
};

export function ShimmerButton({
  href,
  children,
  className,
  arrow = true,
  onClick,
  tone = "primary",
}: Props) {
  return (
    <Link href={href} className={cn("btn-shimmer", tone === "light" && "btn-shimmer-light", className)} onClick={onClick}>
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {arrow ? <ArrowRight className="h-4 w-4" /> : null}
      </span>
    </Link>
  );
}
