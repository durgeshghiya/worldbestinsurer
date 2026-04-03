import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "World Best Insurer — Compare Insurance Plans Globally";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #1e2b7a 0%, #2d3a8c 50%, #1a1a2e 100%)",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(196, 125, 46, 0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(196, 64, 88, 0.1)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.1)",
              border: "2px solid rgba(196, 125, 46, 0.5)",
            }}
          >
            <span
              style={{
                fontSize: "36px",
                fontWeight: 800,
                color: "white",
                letterSpacing: "-1px",
              }}
            >
              WBI
            </span>
          </div>
          <span
            style={{
              fontSize: "44px",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            World Best Insurer
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "26px",
            color: "rgba(255,255,255,0.6)",
            maxWidth: "700px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Compare health, term life, motor &amp; travel insurance across 12 countries
        </p>

        {/* Accent line */}
        <div
          style={{
            width: "120px",
            height: "4px",
            background: "#c47d2e",
            borderRadius: "2px",
            marginTop: "32px",
          }}
        />

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            marginTop: "40px",
          }}
        >
          {[
            { num: "248+", label: "Insurers" },
            { num: "12", label: "Countries" },
            { num: "30K+", label: "Pages" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "36px", fontWeight: 700, color: "#c47d2e" }}>
                {s.num}
              </span>
              <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
