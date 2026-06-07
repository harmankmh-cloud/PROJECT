import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          background: "linear-gradient(135deg, #14b8a6 0%, #8b5cf6 50%, #5eead4 100%)",
          fontSize: 18,
        }}
      >
        ☎
      </div>
    ),
    { ...size }
  );
}
