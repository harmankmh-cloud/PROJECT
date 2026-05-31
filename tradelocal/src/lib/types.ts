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
};
