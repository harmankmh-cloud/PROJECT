"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

export function NotificationBell({ count, href = "/dashboard/messages" }: { count: number; href?: string }) {
  return (
    <Link
      href={href}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted hover:text-foreground"
      aria-label={`${count} notifications`}
    >
      <Bell className="h-4 w-4" />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  );
}
