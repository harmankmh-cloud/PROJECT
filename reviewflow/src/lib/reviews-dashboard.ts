import { createClient } from "@/lib/supabase/server";
import type { FeedbackEvent } from "@/lib/types";

export type ReviewWithResponse = {
  id: string;
  author_name: string;
  star_rating: number;
  body: string;
  created_at: string;
  response: { body: string; created_at: string } | null;
};

export type GoogleReviewDraft = {
  id: string;
  customer_name: string | null;
  star_rating: number | null;
  customer_notes: string | null;
  ai_draft: string | null;
  created_at: string;
};

export async function getRespondDashboardData(businessId: string) {
  const supabase = await createClient();

  const [reviewsResult, feedbackResult] = await Promise.all([
    supabase
      .from("reviews")
      .select(
        `
        id,
        author_name,
        star_rating,
        body,
        created_at,
        review_responses ( body, created_at )
      `
      )
      .eq("business_id", businessId)
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("feedback_events")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_private", false)
      .not("customer_notes", "is", null)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const reviews: ReviewWithResponse[] = (reviewsResult.data ?? []).map((row) => {
    const responses = row.review_responses as { body: string; created_at: string }[] | null;
    const response = responses?.[0] ?? null;
    return {
      id: row.id,
      author_name: row.author_name,
      star_rating: row.star_rating,
      body: row.body,
      created_at: row.created_at,
      response,
    };
  });

  const googleDrafts: GoogleReviewDraft[] = (feedbackResult.data ?? []).map((row) => ({
    id: row.id,
    customer_name: row.customer_name,
    star_rating: row.star_rating,
    customer_notes: row.customer_notes,
    ai_draft: row.ai_draft,
    created_at: row.created_at,
  }));

  const unansweredProfile = reviews.filter((r) => !r.response);
  const unansweredGoogle = googleDrafts;

  return {
    reviews,
    googleDrafts,
    unansweredProfile,
    unansweredGoogle,
    feedback: (feedbackResult.data ?? []) as FeedbackEvent[],
  };
}
