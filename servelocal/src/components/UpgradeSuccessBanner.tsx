"use client";

import { useSearchParams } from "next/navigation";

export function UpgradeSuccessBanner() {
  const params = useSearchParams();
  if (params.get("upgraded") !== "1") return null;

  return (
    <div className="mt-6 rounded-xl border border-teal-200 bg-teal-50/80 p-4 text-sm text-teal-900">
      <p className="font-semibold">You&apos;re upgraded — welcome to Featured Pro.</p>
      <p className="mt-1 text-teal-800/90">
        Your listing is now featured. Job alerts and top placement are active — check Recent jobs below.
      </p>
    </div>
  );
}
