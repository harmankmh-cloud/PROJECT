"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function useCustomerBack() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });
  }, []);

  function goBack() {
    if (isLoggedIn) {
      router.push("/dashboard");
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
      return;
    }
    router.push("/");
  }

  return {
    isLoggedIn,
    goBack,
    backLabel: isLoggedIn ? "Back to dashboard" : "Back",
  };
}
