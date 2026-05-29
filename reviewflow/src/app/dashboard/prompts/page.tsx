import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PromptEditor } from "@/components/PromptEditor";

export default async function PromptsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!business) redirect("/dashboard");

  const { data: prompts } = await supabase
    .from("prompt_templates")
    .select("*")
    .eq("business_id", business.id)
    .order("experience_level");

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/dashboard" className="text-sm font-medium text-emerald-700">
          ← Back to dashboard
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">Edit review prompts</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Change the button text and AI instructions for each experience level.
          </p>
        </div>
        <PromptEditor businessId={business.id} prompts={prompts || []} />
      </div>
    </main>
  );
}
