import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export default function ReviewNotFound() {
  return (
    <main className="mesh-bg flex min-h-screen items-center justify-center px-4">
      <div className="surface-card max-w-md p-8 text-center">
        <p className="text-4xl">🔍</p>
        <h1 className="font-display mt-4 text-2xl text-brand-950">Link not found</h1>
        <p className="mt-2 text-sm text-stone-500">
          This review page doesn&apos;t exist or may have been renamed.
        </p>
        <Link href="/" className="btn-gold mt-6 inline-flex">
          Go to ReviewFlow
        </Link>
      </div>
    </main>
  );
}
