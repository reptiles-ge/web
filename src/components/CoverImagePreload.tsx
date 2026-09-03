import { preload } from "react-dom";

import { pictureSources } from "@/data/optimizedImages";

type CoverImagePreloadProps = {
  media?: string;
  sizes: string;
  src: null | string | undefined;
};

export function CoverImagePreload({
  media,
  sizes,
  src,
}: CoverImagePreloadProps) {
  if (!src) return null;

  const best = pictureSources(src, {
    sizes,
    ...(media ? { media } : {}),
  })[0];

  if (!best) {
    preload(src, {
      as: "image",
      fetchPriority: "high",
      ...(media ? { media } : {}),
    });
    return null;
  }

  preload(src, {
    as: "image",
    fetchPriority: "high",
    imageSizes: best.props.sizes,
    imageSrcSet: best.props.srcSet,
    type: best.props.type,
    ...(media ? { media } : {}),
  });
  return null;
}
