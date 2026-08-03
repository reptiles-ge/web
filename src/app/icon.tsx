import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

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
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#142018",
          color: "#f4f1ea",
          fontSize: 220,
          fontWeight: 700,
          letterSpacing: "-0.06em",
        }}
      >
        {siteConfig.name.slice(0, 1)}
      </div>
    ),
    { ...size },
  );
}
