export function buildAppIconSvg({
  width,
  height,
  rx,
  gradientId = "g",
}: {
  width: number;
  height: number;
  rx: number;
  gradientId?: string;
}) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" rx="${rx}" fill="url(#${gradientId})" />
      <path d="M8 4h12a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4h-2l-3 3v-3H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z" fill="#fff" />
      <defs>
        <linearGradient id="${gradientId}" x1="10" y1="10" x2="${width - 10}" y2="${height - 10}" gradientUnits="userSpaceOnUse">
          <stop stop-color="#14b8a6" />
          <stop offset="0.5" stop-color="#8b5cf6" />
          <stop offset="1" stop-color="#5eead4" />
        </linearGradient>
      </defs>
    </svg>
  `;
}
