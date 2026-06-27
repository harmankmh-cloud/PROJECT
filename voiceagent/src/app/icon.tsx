import { buildAppIconSvg } from "@/lib/icon-svg";

export const size = { width: 32, height: 32 };
export const contentType = "image/svg+xml";

export default function Icon() {
  const svg = buildAppIconSvg({ width: size.width, height: size.height, rx: 8 });

  return new Response(svg, {
    headers: { "content-type": contentType },
  });
}
