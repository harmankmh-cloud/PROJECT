export type ExperienceLevel = "great" | "good" | "okay" | "bad";
export type StarRating = 1 | 2 | 3 | 4 | 5;

export type PlanId = "trial" | "active" | "past_due" | "canceled";

export type Business = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  business_type: string;
  google_review_url: string | null;
  tone: string;
  plan?: PlanId | string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  subscription_status?: string | null;
  setup_paid_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type PromptTemplate = {
  id: string;
  business_id: string;
  experience_level: ExperienceLevel;
  helper_label: string;
  placeholder: string;
  ai_instruction: string;
};

export type FeedbackEvent = {
  id: string;
  business_id: string;
  experience_level: ExperienceLevel;
  star_rating: number | null;
  customer_notes: string | null;
  ai_draft: string | null;
  is_private: boolean;
  customer_name: string | null;
  created_at: string;
};

export type DashboardStats = {
  pageViews: number;
  googleClicks: number;
  ownerNotifications: number;
  publicDrafts: number;
};

export type UsageSummary = {
  used: number;
  limit: number;
  remaining: number;
  percent: number;
  atLimit: boolean;
  plan: PlanId;
  planLabel: string;
};

export type BusinessHours = Record<
  string,
  { open: string; close: string; closed: boolean }
>;

export type SubRatings = {
  quality?: number;
  value?: number;
  service?: number;
  atmosphere?: number;
};

export type PublicBusiness = {
  id: string;
  slug: string;
  name: string;
  business_type: string;
  description?: string | null;
  cover_photo_url?: string | null;
  logo_url?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  phone?: string | null;
  website?: string | null;
  hours?: BusinessHours | null;
  price_range?: number | null;
  amenities?: string[] | null;
  is_claimed?: boolean;
  is_listed?: boolean;
  avg_rating?: number | null;
  review_count?: number | null;
  ai_summary?: string | null;
  ai_summary_tags?: string[] | null;
  is_open_now?: boolean;
  gallery_photos?: string[];
};

export type OwnerResponse = {
  body: string;
  created_at: string;
};

export type PublicReview = {
  id: string;
  business_id: string;
  author_name: string;
  author_avatar_url?: string | null;
  star_rating: number;
  body: string;
  sub_ratings?: SubRatings | null;
  helpful_count: number;
  is_verified_visit: boolean;
  created_at: string;
  photos?: string[];
  owner_response?: OwnerResponse | null;
};

export type RatingBreakdown = {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
};
