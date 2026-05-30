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
    <main className="flex-1 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
            Customization
          </p>
          <h1 className="font-display mt-1 text-3xl text-brand-950">Review scripts</h1>
          <p className="mt-2 text-sm text-stone-500">
            Control what customers see and how AI writes for each experience level.
          </p>
        </header>
        <PromptEditor businessId={business.id} prompts={prompts || []} />
      </div>
    </main>
  );
}
