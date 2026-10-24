import { Image } from "antd";

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
    <Image
      alt=""
      height={height}
      preview={{ src: optimizedImgSrc(src, 1600) }}
      src={optimizedImgSrc(src, 320)}
      style={{ objectFit: "cover" }}
      width={width}
    />
  );
}
