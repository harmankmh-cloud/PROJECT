import { buildAppIconSvg } from "@/lib/icon-svg";

export const size = { width: 180, height: 180 };
export const contentType = "image/svg+xml";

export default function AppleIcon() {
  const svg = buildAppIconSvg({ width: size.width, height: size.height, rx: 36 });

  return new Response(svg, {
    headers: { "content-type": contentType },
  });
}
