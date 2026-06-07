/** Static marketing content: blog posts, FAQs, about copy. */

export const SITE_FAQS = [
  {
    q: "Is ServeLocal free for homeowners?",
    a: "Yes. Posting a job and browsing pros is free. You call the tradie you choose directly — we never charge homeowners a lead fee.",
  },
  {
    q: "How do tradies get listed?",
    a: "Apply at Get listed with your business details. Our team reviews applications within 1–2 business days. Starter listings are free; Featured and Premium plans add placement and badges.",
  },
  {
    q: "How is ServeLocal different from Thumbtack or HomeStars?",
    a: "We don't sell shared leads. Pros pay one flat monthly fee (or list free) and homeowners contact them direct. No $25–75 per-click lead charges.",
  },
  {
    q: "Are pros verified?",
    a: "Verified and insurance badges are reviewed by our admin team when pros submit licence or insurance documentation. Always confirm credentials before hiring.",
  },
  {
    q: "What areas do you cover?",
    a: "Fraser Valley and Metro Vancouver — Surrey, Langley, Abbotsford, Chilliwack, Mission, Delta, Burnaby, and Vancouver.",
  },
  {
    q: "Do I need an account to post a job?",
    a: "No. Guests can post jobs. Create a free account to track your requests on My account.",
  },
  {
    q: "How do reviews work?",
    a: "Homeowners can leave reviews on pro profiles after working together. Reviews are moderated before they appear publicly.",
  },
  {
    q: "What if I can't find a pro in my area?",
    a: "Post your job anyway — we notify pros as listings grow. Check nearby cities or browse our BC cost guides while you wait.",
  },
] as const;

export const BLOG_POSTS = [
  {
    slug: "spot-bad-plumber-bc",
    title: "How to Spot a Bad Plumber in BC",
    excerpt: "Red flags before you hire — licence checks, quote patterns, and when to walk away.",
    date: "2026-05-28",
    readMinutes: 6,
    category: "Hiring tips",
  },
  {
    slug: "fence-cost-fraser-valley",
    title: "Average Cost to Install a Fence in the Fraser Valley",
    excerpt: "Cedar vs vinyl, per-foot pricing, and what drives quotes up in Surrey and Langley.",
    date: "2026-05-21",
    readMinutes: 5,
    category: "Cost guides",
  },
  {
    slug: "bc-home-maintenance-summer",
    title: "BC Home Maintenance Checklist for Summer",
    excerpt: "Gutters, HVAC tune-ups, deck inspections, and pest prevention before peak season.",
    date: "2026-05-14",
    readMinutes: 7,
    category: "Maintenance",
  },
  {
    slug: "ev-charger-install-bc",
    title: "EV Charger Install Costs in Metro Vancouver",
    excerpt: "Panel capacity, permit requirements, and typical install ranges for Level 2 home chargers.",
    date: "2026-05-07",
    readMinutes: 5,
    category: "Electrician",
  },
  {
    slug: "hire-roofer-bc",
    title: "5 Questions to Ask Before Hiring a Roofer",
    excerpt: "WSBC clearance, warranty terms, and why three written quotes matter for re-roofs.",
    date: "2026-04-30",
    readMinutes: 4,
    category: "Hiring tips",
  },
] as const;

export type BlogSlug = (typeof BLOG_POSTS)[number]["slug"];

export const BLOG_ARTICLES: Record<
  BlogSlug,
  { sections: { heading?: string; paragraphs: string[] }[] }
> = {
  "spot-bad-plumber-bc": {
    sections: [
      {
        paragraphs: [
          "A good BC plumber shows their licence number, gives written quotes for larger jobs, and explains dispatch fees upfront. If someone refuses to provide a licence or pushes for cash-only with no receipt, that's a stop sign.",
          "Compare at least two quotes for anything beyond a simple fixture swap. Huge gaps often mean different scope — one quote may include permit pull and cleanup while another doesn't.",
        ],
      },
      {
        heading: "Licence and insurance",
        paragraphs: [
          "Regulated plumbing work requires a licensed plumber in British Columbia. Ask for the licence number and verify it. Liability insurance protects you if something goes wrong on your property.",
        ],
      },
      {
        heading: "Quote red flags",
        paragraphs: [
          "Phone-only estimates for major work, pressure to decide immediately, or unusually low prices that double once they're on site are common warning signs. Get scope in writing.",
        ],
      },
    ],
  },
  "fence-cost-fraser-valley": {
    sections: [
      {
        paragraphs: [
          "Fence pricing in the Fraser Valley is usually quoted per linear foot. Cedar runs higher than basic pressure-treated wood; vinyl and composite sit at the top of the range but need less staining.",
          "Shared property-line fences may split cost with neighbours — check your title and municipal rules before you build.",
        ],
      },
      {
        heading: "Typical ranges",
        paragraphs: [
          "Expect roughly $45–$75 per foot for 6' cedar on flat ground. Gates, stepping terrain, rock, and old fence removal add cost. Get three written quotes for projects over $3,000.",
        ],
      },
    ],
  },
  "bc-home-maintenance-summer": {
    sections: [
      {
        paragraphs: [
          "Summer in BC is the window for exterior work before the wet season. Schedule HVAC tune-ups early — fall books fill fast once heating season starts.",
          "Clear gutters after spring pollen and seed pods. Inspect decks for soft boards and popped nails. Trim trees away from roofs and power lines before winter storms.",
        ],
      },
      {
        heading: "Quick checklist",
        paragraphs: [
          "Furnace or heat pump service, AC check, gutter clean, deck inspection, caulking around windows, pest perimeter treatment, and test smoke/CO detectors.",
        ],
      },
    ],
  },
  "ev-charger-install-bc": {
    sections: [
      {
        paragraphs: [
          "Level 2 home EV chargers typically need a 240V circuit. If your panel is full or still 100A, you may need a panel upgrade — that's often the biggest cost variable.",
          "Licensed electricians should pull permits where required and coordinate inspection. Install-only quotes exclude the charger hardware unless stated.",
        ],
      },
      {
        heading: "Budget",
        paragraphs: [
          "Many Metro Vancouver installs land between $800 and $2,500 depending on wire run length and panel work. Get quotes from electricians who've done EV installs before.",
        ],
      },
    ],
  },
  "hire-roofer-bc": {
    sections: [
      {
        paragraphs: [
          "Roofing is project-priced, not hourly. Ask about WSBC clearance, liability insurance, shingle brand, labour warranty, and who hauls away old materials.",
          "Leak patches can be same-week; full re-roofs need dry weather windows and may take several days.",
        ],
      },
      {
        heading: "Must-ask questions",
        paragraphs: [
          "How many layers will you remove? Is decking replacement included if rotten? What's the warranty on labour vs materials? Can I see a recent reference for a similar roof type?",
        ],
      },
    ],
  },
};

export const ABOUT_CONTENT = {
  mission:
    "ServeLocal connects BC homeowners with local trades they can call direct — no middleman, no per-lead fees. We focus on Fraser Valley and Metro Vancouver because local pricing and local reputations matter.",
  story:
    "We built ServeLocal after seeing tradies pay hundreds per month for shared leads on national platforms — while homeowners still couldn't tell who was actually available in their neighbourhood. Our model is simple: free or flat-rate listings for pros, free job posts for homeowners, and transparent BC cost guides so everyone knows what fair pricing looks like.",
  values: [
    { title: "Local first", body: "Eight BC cities, real profiles, direct phone and WhatsApp contact." },
    { title: "Transparent pricing", body: "Cost guides and flat pro plans — no surprise lead charges." },
    { title: "Trust by review", body: "Moderated reviews and admin-verified licence badges." },
  ],
} as const;
