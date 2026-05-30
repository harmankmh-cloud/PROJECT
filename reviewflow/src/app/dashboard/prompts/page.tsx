import { redirect } from "next/navigation";
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
    <main className="px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Review prompts</h1>
          <p className="mt-2 text-sm text-slate-600">
            Customize the button text and AI instructions for each experience level.
          </p>
        </div>
        <PromptEditor businessId={business.id} prompts={prompts || []} />
      </div>
    </main>
  );
}
