import { ImageResponse } from "next/og";
import { SERVE_LOCAL } from "@/lib/constants";

export const alt = `${SERVE_LOCAL.name} — local trades in BC`;
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
          background: "linear-gradient(135deg, #0f172a 0%, #134e4a 50%, #78350f 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "linear-gradient(135deg, #f59e0b, #14b8a6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            S
          </div>
          <span style={{ fontSize: 48, fontWeight: 800 }}>{SERVE_LOCAL.name}</span>
        </div>
        <p style={{ fontSize: 36, opacity: 0.9, maxWidth: 900, lineHeight: 1.3 }}>
          {SERVE_LOCAL.tagline} — Fraser Valley & Metro Vancouver
        </p>
      </div>
    ),
    { ...size }
  );
}
