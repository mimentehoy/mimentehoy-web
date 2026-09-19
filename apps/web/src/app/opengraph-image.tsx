import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #001733 0%, #009bb0 35%, #17aba3 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: 64,
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, opacity: 0.9 }}>MIMENTEHOY</div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 20 }}>Entenderles cambia la forma de ayudarles.</div>
        <div style={{ fontSize: 36, marginTop: 28, opacity: 0.9 }}>Artículos, recursos y herramientas para familias.</div>
      </div>
    ),
    size,
  );
}
