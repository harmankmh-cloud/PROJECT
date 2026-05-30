"use client";

import Link from "next/link";
import { useCustomerBack } from "@/components/useCustomerBack";
import { BrandLogo } from "@/components/BrandLogo";

export function ReviewNotFoundContent() {
  const { isLoggedIn, goBack } = useCustomerBack();

  return (
    <main className="mesh-bg flex min-h-screen items-center justify-center px-4">
      <div className="surface-card max-w-md p-8 text-center">
        <BrandLogo href="/" />
        <p className="mt-6 text-4xl">🔍</p>
        <h1 className="font-display mt-4 text-2xl text-brand-950">Review link not found</h1>
        <p className="mt-2 text-sm text-stone-500">
          This page doesn&apos;t exist or the business may have changed their link.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-gold inline-flex justify-center py-3">
              Back to dashboard
            </Link>
          ) : (
            <button type="button" onClick={goBack} className="btn-gold py-3">
              Go back
            </button>
          )}
          <Link href="/" className="btn-ghost inline-flex justify-center py-3">
            ReviewFlow home
          </Link>
        </div>
      </div>
    </main>
  );
}
