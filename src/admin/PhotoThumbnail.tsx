import { Image, Popover } from "antd";

import { optimizedImgSrc } from "@/data/optimizedImages";

export function PhotoThumbnail({
  height = 56,
  src,
  width = 84,
}: {
  height?: number;
  src: string;
  width?: number;
}) {
  return (
    <Popover
      content={
        <img
          alt=""
          src={optimizedImgSrc(src, 1200)}
          style={{
            display: "block",
            maxHeight: "70vh",
            maxWidth: "min(560px, 80vw)",
            objectFit: "contain",
          }}
        />
      }
      destroyOnHidden
      mouseEnterDelay={0.15}
      placement="right"
      styles={{ container: { padding: 4 } }}
    >
      <span style={{ display: "inline-block" }}>
        <Image
          alt=""
          height={height}
          preview={{ src: optimizedImgSrc(src, 1600) }}
          src={optimizedImgSrc(src, 320)}
          style={{ objectFit: "cover" }}
          width={width}
        />
      </span>
    </Popover>
  );
}
