import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
          background: "linear-gradient(135deg, #14b8a6 0%, #8b5cf6 50%, #5eead4 100%)",
          fontSize: 72,
        }}
      >
        ☎
      </div>
    ),
    { ...size }
  );
}
