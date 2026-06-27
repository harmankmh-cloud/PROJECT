import { BRAND } from "@/lib/brand";

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const ogTitle = "AI phone agents that never miss a call";

export const alt = BRAND.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/svg+xml";

export default function OpenGraphImage() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="#0c1222" />
      <rect x="0" y="0" width="1200" height="630" fill="url(#bg)" />
      <circle cx="180" cy="180" r="120" fill="rgba(255,255,255,0.08)" />
      <text x="80" y="220" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="60" font-weight="700">${escapeSvgText(BRAND.name)}</text>
      <text x="80" y="310" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="44" font-weight="700">${ogTitle}</text>
      <text x="80" y="372" fill="rgba(255,255,255,0.7)" font-family="Inter, Arial, sans-serif" font-size="26">${escapeSvgText(BRAND.tagline)}</text>
      <rect x="80" y="430" width="300" height="70" rx="16" fill="#14b8a6" />
      <text x="115" y="472" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">Book a demo</text>
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#0c1222" />
          <stop offset="0.45" stop-color="#141d33" />
          <stop offset="1" stop-color="#0a1020" />
        </linearGradient>
      </defs>
    </svg>
  `;

  return new Response(svg, {
    headers: { "content-type": contentType },
  });
}
