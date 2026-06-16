import { ImageResponse } from "next/og";

// Next.js App Router automatically uses this file as the tab favicon.
// It renders this React component to a PNG image on the server.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0a0f1c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
        }}
      >
        <span
          style={{
            color: "#06b6d4",
            fontSize: 14,
            fontWeight: 800,
            fontFamily: "sans-serif",
            letterSpacing: "-1px",
          }}
        >
          SG
        </span>
      </div>
    ),
    { ...size }
  );
}
