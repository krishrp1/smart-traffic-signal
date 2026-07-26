import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Smart Traffic Signal — Interactive Traffic Simulation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#ef4444" }} />
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#f59e0b" }} />
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#22c55e" }} />
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>Smart Traffic Signal</div>
      </div>
      <div style={{ marginTop: 24, fontSize: 28, color: "#cbd5e1" }}>
        Interactive priority-scheduling traffic simulation
      </div>
    </div>,
    { ...size },
  );
}
