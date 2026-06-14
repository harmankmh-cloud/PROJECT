"use client";

import Link from "next/link";
import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";

export function AgentConfigBottomBar({ agentId }: { agentId?: string }) {
  const [loading, setLoading] = useState(false);
  const href = agentId ? `/dashboard/sandbox?agent=${agentId}` : "/dashboard/sandbox";

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 border-t border-outline-variant/10 glass-panel p-5 md:bottom-0">
      <div className="mx-auto max-w-lg">
        <Link
          href={href}
          onClick={() => setLoading(true)}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary shadow-xl transition-all hover:scale-[1.02] hover:shadow-electric-blue/20 active:scale-95"
        >
          {loading ? (
            <>
              <MaterialIcon name="refresh" className="animate-spin" />
              Loading Sandbox…
            </>
          ) : (
            <>
              <MaterialIcon name="science" filled />
              Launch Test Sandbox
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
