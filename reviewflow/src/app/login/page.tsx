import Link from "next/link";
import { AuthForm } from "@/components/Forms";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16">
      <div className="mx-auto max-w-md space-y-6">
        <Link href="/" className="text-sm font-medium text-emerald-700">
          ← Back to ReviewFlow
        </Link>
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
