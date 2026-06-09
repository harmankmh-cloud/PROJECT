import type { PublicBusiness, PublicReview } from "@/lib/types";

const HOURS = {
  mon: { open: "09:00", close: "18:00", closed: false },
  tue: { open: "09:00", close: "18:00", closed: false },
  wed: { open: "09:00", close: "18:00", closed: false },
  thu: { open: "09:00", close: "18:00", closed: false },
  fri: { open: "09:00", close: "20:00", closed: false },
  sat: { open: "10:00", close: "17:00", closed: false },
  sun: { open: "10:00", close: "16:00", closed: false },
};

export const SEED_BUSINESSES: PublicBusiness[] = [
  {
    id: "b1000001-0000-4000-8000-000000000001",
    slug: "main-street-bistro-abbotsford",
    name: "Main Street Bistro",
    business_type: "Restaurants",
    description:
      "Farm-to-table dining in the heart of Abbotsford. Seasonal menus featuring Fraser Valley ingredients.",
    cover_photo_url:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop",
    logo_url:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop",
    address: "33714 South Fraser Way",
    city: "Abbotsford",
    province: "BC",
    postal_code: "V2S 2C6",
    phone: "(604) 555-0142",
    website: "https://example.com",
    hours: HOURS,
    price_range: 2,
    amenities: ["Parking", "Wheelchair Accessible", "Outdoor Seating", "Takeout"],
    is_claimed: true,
    is_listed: true,
    avg_rating: 4.7,
    review_count: 128,
    ai_summary:
      "Customers love the fast service and friendly staff. The seasonal menu gets rave reviews. Some mention parking can be difficult on weekends.",
    ai_summary_tags: ["FastService", "Friendly", "SeasonalMenu", "Parking"],
    is_open_now: true,
    gallery_photos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1550966841-3ee2d90989c7?w=600&h=400&fit=crop",
    ],
  },
  {
    id: "b1000001-0000-4000-8000-000000000002",
    slug: "pacific-auto-care-vancouver",
    name: "Pacific Auto Care",
    business_type: "Auto",
    description: "Trusted auto repair and maintenance serving Vancouver since 2008.",
    cover_photo_url:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=400&fit=crop",
    logo_url:
      "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=200&h=200&fit=crop",
    address: "1245 Commercial Dr",
    city: "Vancouver",
    province: "BC",
    postal_code: "V5L 3X5",
    phone: "(604) 555-0198",
    website: "https://example.com",
    hours: HOURS,
    price_range: 2,
    amenities: ["Free Wi-Fi", "Waiting Area", "Loaner Cars"],
    is_claimed: true,
    is_listed: true,
    avg_rating: 4.5,
    review_count: 89,
    ai_summary:
      "Customers praise honest pricing and quick turnaround. Technicians explain repairs clearly. Wait times can vary during peak hours.",
    ai_summary_tags: ["Honest", "QuickService", "Knowledgeable"],
    is_open_now: true,
    gallery_photos: [
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
    ],
  },
  {
    id: "b1000001-0000-4000-8000-000000000003",
    slug: "luxe-hair-studio-calgary",
    name: "Luxe Hair Studio",
    business_type: "Salons",
    description: "Premium hair styling and colour services in Calgary's Beltline.",
    cover_photo_url:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=400&fit=crop",
    logo_url:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop",
    address: "220 12 Ave SW",
    city: "Calgary",
    province: "AB",
    postal_code: "T2R 0G9",
    phone: "(403) 555-0167",
    hours: HOURS,
    price_range: 3,
    amenities: ["Wheelchair Accessible", "Online Booking", "Parking"],
    is_claimed: true,
    is_listed: true,
    avg_rating: 4.8,
    review_count: 156,
    ai_summary:
      "Stylists are highly skilled and attentive. The salon atmosphere is relaxing and modern. Booking ahead is recommended.",
    ai_summary_tags: ["Skilled", "Atmosphere", "Friendly"],
    is_open_now: true,
    gallery_photos: [
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=400&fit=crop",
    ],
  },
  {
    id: "b1000001-0000-4000-8000-000000000004",
    slug: "maple-leaf-dental-toronto",
    name: "Maple Leaf Dental",
    business_type: "Health",
    description: "Family dentistry with a gentle approach for patients of all ages.",
    cover_photo_url:
      "https://images.unsplash.com/photo-1629909613654-28e495c93d4a?w=1200&h=400&fit=crop",
    logo_url:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=200&h=200&fit=crop",
    address: "89 Bloor St W",
    city: "Toronto",
    province: "ON",
    postal_code: "M5S 1M1",
    phone: "(416) 555-0134",
    hours: HOURS,
    price_range: 3,
    amenities: ["Wheelchair Accessible", "Free Parking", "Evening Hours"],
    is_claimed: false,
    is_listed: true,
    avg_rating: 4.6,
    review_count: 72,
    ai_summary:
      "Patients appreciate the gentle care and clear explanations. The office is clean and modern. Scheduling can be tight for new patients.",
    ai_summary_tags: ["Gentle", "Professional", "Clean"],
    is_open_now: false,
    gallery_photos: [],
  },
  {
    id: "b1000001-0000-4000-8000-000000000005",
    slug: "northern-lights-plumbing-edmonton",
    name: "Northern Lights Plumbing",
    business_type: "Services",
    description: "24/7 emergency plumbing and heating services across Edmonton.",
    cover_photo_url:
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200&h=400&fit=crop",
    logo_url:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop",
    address: "10234 Jasper Ave",
    city: "Edmonton",
    province: "AB",
    postal_code: "T5J 1Z8",
    phone: "(780) 555-0189",
    hours: { ...HOURS, sun: { open: "00:00", close: "00:00", closed: true } },
    price_range: 2,
    amenities: ["24/7 Emergency", "Licensed", "Free Estimates"],
    is_claimed: true,
    is_listed: true,
    avg_rating: 4.4,
    review_count: 64,
    ai_summary:
      "Reliable emergency response and fair pricing. Technicians are professional and tidy. Response times are excellent.",
    ai_summary_tags: ["Reliable", "FairPricing", "Professional"],
    is_open_now: true,
    gallery_photos: [],
  },
  {
    id: "b1000001-0000-4000-8000-000000000006",
    slug: "harbour-view-cafe-vancouver",
    name: "Harbour View Café",
    business_type: "Restaurants",
    description: "Waterfront café serving artisan coffee and fresh pastries daily.",
    cover_photo_url:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=400&fit=crop",
    logo_url:
      "https://images.unsplash.com/photo-1495474472287-4d89bcf2f2e2?w=200&h=200&fit=crop",
    address: "1600 Canada Pl",
    city: "Vancouver",
    province: "BC",
    postal_code: "V6C 3T5",
    phone: "(604) 555-0176",
    hours: HOURS,
    price_range: 1,
    amenities: ["Outdoor Seating", "Pet Friendly", "Wi-Fi"],
    is_claimed: true,
    is_listed: true,
    avg_rating: 4.9,
    review_count: 203,
    ai_summary:
      "Amazing harbour views and excellent coffee. Pastries are baked fresh daily. Can get busy during cruise season.",
    ai_summary_tags: ["Views", "Coffee", "Fresh", "Busy"],
    is_open_now: true,
    gallery_photos: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
    ],
  },
];

export const SEED_REVIEWS: Record<string, PublicReview[]> = {
  "main-street-bistro-abbotsford": [
    {
      id: "a1000001-0000-4000-8000-000000000001",
      business_id: "b1000001-0000-4000-8000-000000000001",
      author_name: "Sarah M.",
      author_avatar_url: null,
      star_rating: 5,
      body: "Absolutely loved our dinner here! The seasonal risotto was incredible and our server was so attentive. Will definitely be back.",
      sub_ratings: { quality: 5, value: 4, service: 5, atmosphere: 5 },
      helpful_count: 12,
      is_verified_visit: true,
      created_at: "2026-05-28T18:30:00Z",
      photos: [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      ],
      owner_response: {
        body: "Thank you Sarah! We're thrilled you enjoyed the risotto — it's one of our chef's favourites too. See you soon!",
        created_at: "2026-05-29T10:00:00Z",
      },
    },
    {
      id: "a1000001-0000-4000-8000-000000000002",
      business_id: "b1000001-0000-4000-8000-000000000001",
      author_name: "James K.",
      author_avatar_url: null,
      star_rating: 4,
      body: "Great food and friendly staff. Only downside was finding parking on a Saturday night. Food made up for it though!",
      sub_ratings: { quality: 5, value: 4, service: 4, atmosphere: 4 },
      helpful_count: 8,
      is_verified_visit: true,
      created_at: "2026-05-20T12:15:00Z",
      photos: [],
      owner_response: null,
    },
    {
      id: "a1000001-0000-4000-8000-000000000003",
      business_id: "b1000001-0000-4000-8000-000000000001",
      author_name: "Priya R.",
      author_avatar_url: null,
      star_rating: 5,
      body: "Best brunch in Abbotsford hands down. Fast service even when busy. The eggs benedict is perfection.",
      sub_ratings: { quality: 5, value: 5, service: 5, atmosphere: 4 },
      helpful_count: 15,
      is_verified_visit: false,
      created_at: "2026-05-15T09:45:00Z",
      photos: [],
      owner_response: null,
    },
  ],
  "pacific-auto-care-vancouver": [
    {
      id: "a1000001-0000-4000-8000-000000000004",
      business_id: "b1000001-0000-4000-8000-000000000002",
      author_name: "Mike T.",
      author_avatar_url: null,
      star_rating: 5,
      body: "Honest mechanics who don't upsell. Fixed my brakes same day and explained everything clearly.",
      sub_ratings: { quality: 5, value: 5, service: 5, atmosphere: 4 },
      helpful_count: 6,
      is_verified_visit: true,
      created_at: "2026-05-25T14:00:00Z",
      photos: [],
      owner_response: {
        body: "Thanks Mike! Transparency is what we're all about.",
        created_at: "2026-05-26T09:00:00Z",
      },
    },
  ],
  "harbour-view-cafe-vancouver": [
    {
      id: "a1000001-0000-4000-8000-000000000005",
      business_id: "b1000001-0000-4000-8000-000000000006",
      author_name: "Emma L.",
      author_avatar_url: null,
      star_rating: 5,
      body: "Stunning views and the best latte I've had in Vancouver. Perfect spot for a morning meeting.",
      sub_ratings: { quality: 5, value: 4, service: 5, atmosphere: 5 },
      helpful_count: 22,
      is_verified_visit: true,
      created_at: "2026-06-01T08:30:00Z",
      photos: [],
      owner_response: null,
    },
  ],
};

export function getSeedBusinessBySlug(slug: string): PublicBusiness | null {
  return SEED_BUSINESSES.find((b) => b.slug === slug) ?? null;
}

export function getSeedReviewsBySlug(slug: string): PublicReview[] {
  return SEED_REVIEWS[slug] ?? [];
}

export function getSeedFeaturedBusinesses(city?: string, limit = 6): PublicBusiness[] {
  let list = [...SEED_BUSINESSES];
  if (city) {
    list = list.filter((b) => b.city?.toLowerCase() === city.toLowerCase());
  }
  return list.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0)).slice(0, limit);
}
