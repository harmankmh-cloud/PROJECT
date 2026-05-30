"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function useCustomerBack() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
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
    if (window.history.length > 1) {
      window.history.back();
    }
  }

  return {
    isLoggedIn,
    goBack,
    backLabel: isLoggedIn ? "Back to dashboard" : "Back",
  };
}
