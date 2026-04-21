import { ImageResponse } from "next/og";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

export const alt = "INDOCOR ITS Student Chapter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Read logo.png as buffer and convert to base64 data URI
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const fileBuffer = await fs.readFile(logoPath);
  const base64Image = fileBuffer.toString("base64");
  const imgSrc = `data:image/png;base64,${base64Image}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a", // Dark theme background
        backgroundImage:
          "radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)",
        backgroundSize: "100px 100px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#111",
          padding: "60px 80px",
          borderRadius: "32px",
          border: "2px solid #333",
          boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <img
            src={imgSrc}
            width={160}
            height={160}
            alt="Logo"
            style={{ marginRight: "40px" }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: "#ffffff",
                margin: 0,
                padding: 0,
                letterSpacing: "-2px",
              }}
            >
              INDOCOR ITS
            </h1>
            <h2
              style={{
                fontSize: 48,
                fontWeight: 600,
                color: "#38bdf8", // Sky blue color
                margin: 0,
                marginTop: "10px",
                padding: 0,
              }}
            >
              Student Chapter
            </h2>
          </div>
        </div>

        <p
          style={{
            fontSize: 32,
            color: "#a3a3a3",
            margin: 0,
            maxWidth: "800px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Official Website of Indonesian Corrosion Association — Student Chapter
          of Institut Teknologi Sepuluh Nopember
        </p>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
