import { pictureSources } from "@/data/optimizedImages";
import { preload } from "react-dom";

type CoverImagePreloadProps = {
  src: string | null | undefined;
  sizes: string;
  media?: string;
};

export function CoverImagePreload({ src, sizes, media }: CoverImagePreloadProps) {
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
    type: best.props.type,
    imageSrcSet: best.props.srcSet,
    imageSizes: best.props.sizes,
    fetchPriority: "high",
    ...(media ? { media } : {}),
  });
  return null;
}
