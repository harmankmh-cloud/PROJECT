import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/admin";
import { ReviewForm } from "@/components/ReviewForm";
import type { Business, PromptTemplate } from "@/lib/types";

async function getBusinessBySlug(slug: string) {
  const supabase = createServiceClient();
  if (!supabase) return null;

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!business) return null;

  const { data: prompts } = await supabase
    .from("prompt_templates")
    .select("*")
    .eq("business_id", business.id);

  return {
    business: business as Business,
    prompts: (prompts || []) as PromptTemplate[],
  };
}

export default async function CustomerReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getBusinessBySlug(slug);

  if (!data) notFound();

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <ReviewForm business={data.business} prompts={data.prompts} />
    </main>
  );
}
