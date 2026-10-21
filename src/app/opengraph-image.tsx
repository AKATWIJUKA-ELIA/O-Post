import { ImageResponse } from "next/og"

// Default share image for pages without their own (home, sections, posts with no photo)
export const alt = "The O-Post: Accurate and Realistic News"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(115deg, #8f0a1e 0%, #c8102e 55%, #8f0a1e 100%)",
          color: "white",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 999,
              border: "10px solid white",
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 999, background: "#16161d" }} />
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>The O-Post</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>Accurate and Realistic News</div>
          <div style={{ fontSize: 30, opacity: 0.85, fontFamily: "sans-serif", letterSpacing: 4 }}>
            NEWS · POLITICS · BUSINESS · SPORTS · CULTURE
          </div>
        </div>
      </div>
    ),
    size,
  )
}
