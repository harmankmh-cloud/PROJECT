"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";

export function CallDetailHeader({ title = "Call Details" }: { title?: string }) {
  const router = useRouter();

  return (
    <div className="sticky top-16 z-40 -mx-5 border-b border-glass-border-subtle glass-panel shadow-sm md:-mx-10 lg:-mx-12">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
          aria-label="Go back"
        >
          <MaterialIcon name="arrow_back" className="text-on-surface" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-on-surface">{title}</h1>
        <Link
          href="/dashboard/calls"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container"
          aria-label="All calls"
        >
          <MaterialIcon name="more_vert" className="text-on-surface" />
        </Link>
      </div>
    </div>
  );
}
