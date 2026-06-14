import type { SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_PROMPTS, slugify } from "@/lib/defaults";
import { validateGoogleReviewUrl } from "@/lib/google-review-url";

export type BusinessSetupInput = {
  name: string;
  businessType: string;
  googleReviewUrl?: string;
  tone?: "friendly" | "professional" | "casual";
};

export async function createBusinessForUser(
  supabase: SupabaseClient,
  userId: string,
  body: BusinessSetupInput
): Promise<{ ok: true; businessId: string } | { ok: false; error: string }> {
  const { data: existingBusiness } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingBusiness) {
    return { ok: true, businessId: existingBusiness.id };
  }

  let googleReviewUrl: string | null = null;
  if (body.googleReviewUrl?.trim()) {
    const validated = validateGoogleReviewUrl(body.googleReviewUrl);
    if (!validated.ok) return { ok: false, error: validated.error };
    googleReviewUrl = validated.value || null;
  }

  const baseSlug = slugify(body.name) || "business";
  let slug = baseSlug;
  let suffix = 1;

  while (suffix < 100) {
    const { data: existing } = await supabase
      .from("businesses")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const { data: business, error } = await supabase
    .from("businesses")
    .insert({
      user_id: userId,
      name: body.name,
      slug,
      business_type: body.businessType,
      google_review_url: googleReviewUrl,
      tone: body.tone || "friendly",
    })
    .select("id")
    .single();

  if (error || !business) {
    return { ok: false, error: error?.message || "Failed to create business" };
  }

  const prompts = DEFAULT_PROMPTS.map((prompt) => ({
    business_id: business.id,
    experience_level: prompt.experience_level,
    helper_label: prompt.helper_label,
    placeholder: prompt.placeholder,
    ai_instruction: prompt.ai_instruction,
  }));

  const { error: promptError } = await supabase.from("prompt_templates").insert(prompts);

  if (promptError) {
    await supabase.from("businesses").delete().eq("id", business.id);
    return { ok: false, error: promptError.message };
  }

  return { ok: true, businessId: business.id };
}

export function businessSetupFromMetadata(
  metadata: Record<string, unknown> | undefined
): BusinessSetupInput | null {
  if (!metadata) return null;

  const name = metadata.pending_business_name;
  const businessType = metadata.pending_business_type;

  if (typeof name !== "string" || typeof businessType !== "string") return null;
  if (name.trim().length < 2 || businessType.trim().length < 2) return null;

  const googleReviewUrl =
    typeof metadata.pending_google_url === "string" ? metadata.pending_google_url : "";

  return {
    name: name.trim(),
    businessType: businessType.trim(),
    googleReviewUrl,
    tone: "friendly",
  };
}
