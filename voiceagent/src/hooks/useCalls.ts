"use client";

import { useQuery } from "@tanstack/react-query";
import type { Call } from "@/lib/types";
import { apiFetch } from "@/lib/api-client";

type CallsResponse = {
  calls: Call[];
  stats: {
    total: number;
    containmentRate: number;
    transferRate: number;
    totalMinutes: number;
  };
};

export function useCalls() {
  return useQuery({
    queryKey: ["calls"],
    queryFn: async () => {
      const res = await apiFetch<CallsResponse>("/api/calls");
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
  });
}
