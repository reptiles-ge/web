import { getSpeciesById } from "@/data/species";
import { ImageResponse } from "next/og";

type ImageProps = {
  params: Promise<{ id: string }>;
};

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function SpeciesOpenGraphImage({ params }: ImageProps) {
  const { id } = await params;
  const item = getSpeciesById(id);

  const title = item?.scientificName ?? "Species";
  const subtitle = item?.commonName ?? "Reptiles";
  const meta = item
    ? `${item.family} · ${item.location}`
    : "Digital encyclopedia";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(150deg, #101612 0%, #1c2820 55%, #2a3830 100%)",
          padding: "64px",
          color: "#f4f1ea",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(244,241,234,0.55)",
          }}
        >
          <span>Reptiles</span>
          <span>{meta}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 700,
              fontStyle: "italic",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              color: "rgba(244,241,234,0.78)",
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            color: "rgba(244,241,234,0.5)",
          }}
        >
          <span
            style={{
              width: 48,
              height: 3,
              background: "#c4a574",
            }}
          />
          <span>Species profile</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
