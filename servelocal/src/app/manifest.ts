import type { MetadataRoute } from "next";
import { SERVE_LOCAL } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SERVE_LOCAL.name,
    short_name: SERVE_LOCAL.name,
    description: "Find local BC trades and call direct — no middleman fees.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f766e",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
