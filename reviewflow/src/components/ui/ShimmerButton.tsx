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
};

export function ShimmerButton({ href, children, className, arrow = true, onClick }: Props) {
  return (
    <Link href={href} className={cn("btn-shimmer", className)} onClick={onClick}>
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {arrow ? <ArrowRight className="h-4 w-4" /> : null}
      </span>
    </Link>
  );
}
