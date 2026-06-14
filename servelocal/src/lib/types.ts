export type ListingTier = "free" | "featured" | "premium";

export type ServiceCategory = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  sort_order: number;
};

export type ServiceProvider = {
  id: string;
  slug: string;
  display_name: string;
  category_slug: string;
  city_slug: string;
  phone: string;
  email: string | null;
  whatsapp: string | null;
  bio: string | null;
  years_experience: number | null;
  licensed: boolean;
  status: "pending" | "approved" | "rejected" | "paused";
  featured: boolean;
  contact_clicks: number;
  created_at: string;
  listing_tier?: ListingTier;
  verified?: boolean;
  insurance_verified?: boolean;
  license_number?: string | null;
  website?: string | null;
  portfolio_urls?: string[];
  business_hours?: string | null;
  response_time?: string | null;
  jobs_completed?: number;
  min_callout_fee?: string | null;
  emergency_available?: boolean;
  avg_rating?: number;
  review_count?: number;
  requested_plan?: ListingTier | string | null;
  owner_user_id?: string | null;
};

export type ServiceRequest = {
  id: string;
  category_slug: string;
  city_slug: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  description: string;
  status: string;
  created_at: string;
  user_id?: string | null;
  urgency?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
};

export type ProviderReview = {
  id: string;
  provider_id: string;
  reviewer_name: string;
  rating: number;
  title: string | null;
  body: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export type ProviderSort = "recommended" | "rating" | "experience" | "reviews";

export type ProviderFilters = {
  citySlug?: string;
  categorySlug?: string;
  featuredOnly?: boolean;
  licensedOnly?: boolean;
  verifiedOnly?: boolean;
  emergencyOnly?: boolean;
  sort?: ProviderSort;
  query?: string;
};

export type SiteSuggestion = {
  id: string;
  message: string;
  email: string | null;
  page_url: string | null;
  status: "new" | "read" | "done";
  created_at: string;
};

export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
export type PaymentStatus = "held" | "released" | "refunded" | "failed";

export type Booking = {
  id: string;
  provider_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  service_description: string;
  scheduled_at: string | null;
  status: BookingStatus;
  base_amount_cents: number;
  addons_cents: number;
  platform_fee_cents: number;
  tax_cents: number;
  total_cents: number;
  payment_status: PaymentStatus;
  user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type SavedSearch = {
  id: string;
  user_id: string;
  email: string;
  label: string;
  query: string | null;
  city_slug: string | null;
  category_slug: string | null;
  licensed_only: boolean;
  verified_only: boolean;
  emergency_only: boolean;
  alerts_enabled: boolean;
  last_notified_at: string | null;
  created_at: string;
};
