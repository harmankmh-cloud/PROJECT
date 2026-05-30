import Link from "next/link";
import { AuthForm } from "@/components/Forms";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
              R
            </div>
            <span className="font-semibold">ReviewFlow</span>
          </Link>
        </div>
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-600">Start collecting reviews in minutes</p>
          <div className="mt-6">
            <AuthForm mode="signup" />
          </div>
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-emerald-700 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
