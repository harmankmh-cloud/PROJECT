export type ExperienceLevel = "great" | "good" | "okay" | "bad";
export type StarRating = 1 | 2 | 3 | 4 | 5;

export type Business = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  business_type: string;
  google_review_url: string | null;
  tone: string;
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
