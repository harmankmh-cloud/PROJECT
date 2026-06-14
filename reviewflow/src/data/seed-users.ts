import type { PublicReview, UserProfile } from "@/lib/types";

export const SEED_USERS: UserProfile[] = [
  {
    id: "u1000001-0000-4000-8000-000000000001",
    display_name: "Sarah M.",
    city: "Abbotsford",
    tier: "expert",
    review_count: 47,
    photo_count: 23,
    helpful_received: 156,
    helpful_given: 89,
    joined_at: "2024-03-15T00:00:00Z",
  },
  {
    id: "u1000001-0000-4000-8000-000000000002",
    display_name: "James K.",
    city: "Vancouver",
    tier: "contributor",
    review_count: 12,
    photo_count: 4,
    helpful_received: 34,
    helpful_given: 21,
    joined_at: "2025-01-20T00:00:00Z",
  },
  {
    id: "u1000001-0000-4000-8000-000000000003",
    display_name: "Priya R.",
    city: "Calgary",
    tier: "elite",
    review_count: 128,
    photo_count: 67,
    helpful_received: 412,
    helpful_given: 203,
    joined_at: "2023-06-01T00:00:00Z",
  },
];

export const SEED_USER_REVIEWS: Record<string, PublicReview[]> = {
  "u1000001-0000-4000-8000-000000000001": [
    {
      id: "a1000001-0000-4000-8000-000000000001",
      business_id: "seed-1",
      author_name: "Sarah M.",
      star_rating: 5,
      body: "Absolutely loved our dinner here! The seasonal risotto was incredible.",
      helpful_count: 12,
      is_verified_visit: true,
      created_at: "2026-05-28T18:30:00Z",
      photos: [],
    },
  ],
};

export function getSeedUser(id: string): UserProfile | null {
  return SEED_USERS.find((u) => u.id === id) ?? null;
}
