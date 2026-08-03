import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ქვეწარმავლებისა და ამფიბიების ციფრული ენციკლოპედია`;
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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #0f1410 0%, #1a241c 48%, #243028 100%)",
          padding: "64px",
          color: "#f4f1ea",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(244,241,234,0.55)",
          }}
        >
          Digital Encyclopedia
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 820,
              fontSize: 34,
              lineHeight: 1.35,
              color: "rgba(244,241,234,0.78)",
            }}
          >
            Reptiles & amphibians — science, photography, discovery.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "rgba(244,241,234,0.5)",
          }}
        >
          <span>Species · Atlas · Identification</span>
          <span
            style={{
              width: 72,
              height: 4,
              background: "#c4a574",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
