import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #090712 0%, #120d24 45%, #1a1145 100%)",
          color: "#f8f8ff",
          display: "flex",
          fontSize: 152,
          fontWeight: 800,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-0.08em",
          width: "100%",
        }}
      >
        s
      </div>
    ),
    size,
  );
}