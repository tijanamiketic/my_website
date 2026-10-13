import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/content/profile";
import { fullName } from "@/lib/config";

export const alt = `${fullName} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const portrait = await readFile(join(process.cwd(), "public/images/portrait.png"));
const portraitSrc = `data:image/png;base64,${portrait.toString("base64")}`;

/** Social share card, generated at build time from your profile + portrait. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(circle at 12% 18%, #C9D3FA 0, transparent 45%), radial-gradient(circle at 88% 30%, #F6D2E0 0, transparent 45%), radial-gradient(circle at 60% 100%, #DCD0F8 0, transparent 50%), #ECEEF3",
          fontFamily: "sans-serif",
          color: "#15161B",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 80px", width: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, color: "#5F6474", marginBottom: 28 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#2A7357" }} />
            {profile.status}
          </div>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>{profile.brand}</div>
          <div
            style={{
              fontSize: 60,
              fontStyle: "italic",
              marginTop: 10,
              backgroundImage: "linear-gradient(100deg, #6E7FE0, #9C86E6 50%, #D9839F)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {profile.role}
          </div>
          <div style={{ fontSize: 28, color: "#3A3D48", marginTop: 30, lineHeight: 1.35 }}>{profile.tagline.replace(/\*\*/g, "")}</div>
        </div>
        <div style={{ position: "absolute", right: 70, bottom: 0, width: 420, height: 520, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              position: "absolute",
              left: 14,
              right: 14,
              top: 90,
              bottom: 0,
              borderRadius: "210px 210px 0 0",
              background: "linear-gradient(180deg, rgba(255,255,255,.7), rgba(255,255,255,.35))",
              border: "2px solid rgba(255,255,255,.9)",
              display: "flex",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={portraitSrc} width={420} height={500} style={{ position: "absolute", bottom: 0, objectFit: "cover", objectPosition: "top" }} alt="" />
        </div>
      </div>
    ),
    size,
  );
}
