/**
 * Seed demo public business profiles and reviews.
 * Run: npx tsx scripts/seed-public-profiles.ts
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env.
 */

import { createClient } from "@supabase/supabase-js";
import { SEED_BUSINESSES, SEED_REVIEWS } from "../src/data/seed-businesses";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

async function seed() {
  for (const biz of SEED_BUSINESSES) {
    const { gallery_photos, is_open_now, ...row } = biz;

    const { data: existing } = await supabase
      .from("businesses")
      .select("id")
      .eq("slug", biz.slug)
      .maybeSingle();

    let businessId = existing?.id;

    if (businessId) {
      await supabase.from("businesses").update(row).eq("id", businessId);
      console.log(`Updated: ${biz.name}`);
    } else {
      const { data: inserted, error } = await supabase
        .from("businesses")
        .insert({
          ...row,
          user_id: "00000000-0000-0000-0000-000000000001",
          google_review_url: "https://maps.google.com",
          tone: "friendly",
        })
        .select("id")
        .single();

      if (error) {
        console.warn(`Skip ${biz.slug}: ${error.message}`);
        continue;
      }
      businessId = inserted.id;
      console.log(`Inserted: ${biz.name}`);
    }

    if (gallery_photos?.length) {
      await supabase.from("business_photos").delete().eq("business_id", businessId);
      await supabase.from("business_photos").insert(
        gallery_photos.map((url, i) => ({
          business_id: businessId,
          url,
          sort_order: i,
        }))
      );
    }

    const reviews = SEED_REVIEWS[biz.slug] ?? [];
    for (const rev of reviews) {
      const { photos, owner_response, ...reviewRow } = rev;

      const { data: existingReview } = await supabase
        .from("reviews")
        .select("id")
        .eq("id", rev.id)
        .maybeSingle();

      if (existingReview) continue;

      const { data: review, error: revErr } = await supabase
        .from("reviews")
        .insert({
          id: rev.id,
          business_id: businessId,
          author_name: reviewRow.author_name,
          author_avatar_url: reviewRow.author_avatar_url,
          star_rating: reviewRow.star_rating,
          body: reviewRow.body,
          sub_ratings: reviewRow.sub_ratings,
          helpful_count: reviewRow.helpful_count,
          is_verified_visit: reviewRow.is_verified_visit,
          created_at: reviewRow.created_at,
        })
        .select("id")
        .single();

      if (revErr) {
        console.warn(`Review skip: ${revErr.message}`);
        continue;
      }

      if (photos?.length) {
        await supabase.from("review_photos").insert(
          photos.map((url, i) => ({
            review_id: review.id,
            url,
            sort_order: i,
          }))
        );
      }

      if (owner_response) {
        await supabase.from("review_responses").insert({
          review_id: review.id,
          business_id: businessId,
          body: owner_response.body,
          created_at: owner_response.created_at,
        });
      }
    }
  }

  console.log("Seed complete.");
}

seed().catch(console.error);
