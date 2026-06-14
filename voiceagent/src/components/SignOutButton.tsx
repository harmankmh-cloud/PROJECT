"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({
  className = "text-sm font-medium text-on-surface-variant transition hover:text-teal-600",
  label = "Sign out",
  showIcon = false,
}: {
  className?: string;
  label?: string;
  showIcon?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  const text = loading ? "Signing out…" : label;
  const iconOnly = !label;

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={className}
      aria-label={label || "Sign out"}
      title={iconOnly ? "Sign out" : undefined}
    >
      {(showIcon || iconOnly) && <MaterialIcon name="logout" className="text-[20px]" />}
      {!iconOnly && text}
    </button>
  );
}
