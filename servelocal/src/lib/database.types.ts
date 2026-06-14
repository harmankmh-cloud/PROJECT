/**
 * Generated-style Supabase types for ServeLocal.
 * Regenerate with: supabase gen types typescript --project-id <id> > src/lib/database.types.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          provider_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          service_description: string;
          scheduled_at: string | null;
          status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
          base_amount_cents: number;
          addons_cents: number;
          platform_fee_cents: number;
          tax_cents: number;
          total_cents: number;
          payment_status: "held" | "released" | "refunded" | "failed";
          user_id: string | null;
          stripe_session_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["bookings"]["Row"]> & {
          provider_id: string;
          customer_name: string;
          customer_email: string;
          service_description: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Row"]>;
      };
      service_requests: {
        Row: {
          id: string;
          category_slug: string;
          city_slug: string;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          description: string;
          status: string;
          user_id: string | null;
          created_at: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          role: "homeowner" | "pro";
          display_name: string | null;
          phone: string | null;
          created_at: string;
          onboarding_completed_at: string | null;
          onboarding_step: number | null;
          notification_email: boolean | null;
          notification_sms: boolean | null;
          preferred_city_slug: string | null;
        };
      };
      service_providers: {
        Row: {
          id: string;
          slug: string;
          display_name: string;
          category_slug: string;
          city_slug: string;
          status: string;
          owner_user_id: string | null;
        };
      };
      provider_reviews: {
        Row: {
          id: string;
          provider_id: string;
          reviewer_name: string;
          rating: number;
          title: string | null;
          body: string;
          status: "pending" | "approved" | "rejected";
          created_at: string;
        };
      };
      message_threads: {
        Row: {
          id: string;
          homeowner_user_id: string;
          provider_id: string;
          subject: string | null;
          last_message_at: string;
          created_at: string;
        };
      };
      saved_searches: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          label: string;
          query: string | null;
          city_slug: string | null;
          category_slug: string | null;
          created_at: string;
        };
      };
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
