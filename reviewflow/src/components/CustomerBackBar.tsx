"use client";

import { useCustomerBack } from "@/components/useCustomerBack";

export function CustomerBackBar() {
  const { goBack, backLabel } = useCustomerBack();

  return (
    <div className="mx-auto mb-4 flex w-full max-w-md justify-start">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-1 rounded-xl border border-[#e8e2d9] bg-white px-4 py-2.5 text-sm font-semibold text-brand-950 shadow-sm hover:bg-cream"
      >
        ← {backLabel}
      </button>
    </div>
  );
}
