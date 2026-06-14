export const BRAND = {
  name: "GreetQ",
  legalName: "GreetQ Inc.",
  tagline: "AI phone agents that greet every caller",
  domain: "greetq.com",
  footer: "GreetQ — AI phone agents that never miss a call",
  productCategory: "Voice AI platform for local businesses",
  location: {
    city: "Vancouver",
    region: "BC",
    country: "Canada",
    label: "Vancouver, British Columbia, Canada",
  },
  contact: {
    email: "hello@greetq.com",
    salesEmail: "sales@greetq.com",
    supportEmail: "support@greetq.com",
    phone: "+1 (604) 791-6991",
    phoneNote: "Sales & support — Mon–Fri 9am–5pm PT",
  },
} as const;

export const APP_URL = `https://${BRAND.domain}`;
