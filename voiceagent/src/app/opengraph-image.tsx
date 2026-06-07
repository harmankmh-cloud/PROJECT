import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

export const alt = BRAND.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0c1222 0%, #141d33 45%, #0a1020 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #14b8a6, #8b5cf6)",
              fontSize: 36,
            }}
          >
            ☎
          </div>
          <span style={{ fontSize: 48, fontWeight: 700 }}>{BRAND.name}</span>
        </div>
        <p style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.2, maxWidth: 900 }}>
          AI phone agents that never miss a call
        </p>
        <p style={{ fontSize: 24, marginTop: 24, color: "rgba(255,255,255,0.65)", maxWidth: 800 }}>
          {BRAND.tagline}
        </p>
      </div>
    ),
    { ...size }
  );
}
