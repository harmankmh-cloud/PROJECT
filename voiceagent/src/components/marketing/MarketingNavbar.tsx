/**
 * Shim — the site chrome was unified on the landing system.
 * All pages importing MarketingNavbar now render the canonical LandingNavbar
 * (Product + Industries dropdowns, violet Sentry-style theme).
 */
export { LandingNavbar as MarketingNavbar } from "@/components/landing/LandingNavbar";
