import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReviewForm } from "@/components/ReviewForm";
import type { Business, PromptTemplate } from "@/lib/types";

export default async function CustomerReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!business) notFound();

  const { data: prompts } = await supabase
    .from("prompt_templates")
    .select("*")
    .eq("business_id", business.id);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/20 px-4 py-10 sm:py-16">
      <ReviewForm
        business={business as Business}
        prompts={(prompts || []) as PromptTemplate[]}
      />
      <p className="mx-auto mt-8 max-w-xl text-center text-xs text-slate-400">
        Powered by ReviewFlow
      </p>
    </main>
  );
}
