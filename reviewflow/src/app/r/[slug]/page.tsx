import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReviewForm } from "@/components/ReviewForm";
import type { Business, PromptTemplate } from "@/lib/types";
import { sortPrompts } from "@/lib/defaults";
import { BRAND } from "@/lib/brand";

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
    <main className="mesh-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div className="hero-glow -left-32 top-0 h-64 w-64 bg-teal-400/12" />
      <div className="hero-glow right-0 top-20 h-48 w-48 bg-amber-500/10" />
      <ReviewForm
        business={business as Business}
        prompts={sortPrompts((prompts || []) as PromptTemplate[])}
      />
      <p className="powered-by relative mt-8">{BRAND.poweredBy}</p>
    </main>
  );
}
