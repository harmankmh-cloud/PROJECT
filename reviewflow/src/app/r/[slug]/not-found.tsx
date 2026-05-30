import Link from "next/link";

export default function ReviewNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="card max-w-md p-8 text-center">
        <h1 className="text-xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600">
          This review link doesn&apos;t exist or may have been removed.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Go to ReviewFlow
        </Link>
      </div>
    </main>
  );
}
