import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReviewForm } from "@/components/ReviewForm";
import type { Business, PromptTemplate } from "@/lib/types";
import { sortPrompts } from "@/lib/defaults";
import { PUBLIC_REVIEW } from "@/content/copy";

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
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-10">
      <ReviewForm
        business={business as Business}
        prompts={sortPrompts((prompts || []) as PromptTemplate[])}
      />
      <p className="powered-by mt-8">{PUBLIC_REVIEW.poweredBy}</p>
    </main>
  );
}
