import { preload } from "react-dom";

import {
  entryPictureSources,
  type ResolvedImageEntry,
  srcSetPreloadUrl,
} from "@/lib/optimizedImageSources";

export type CoverImagePreloadProps = {
  media?: string;
  sizes: string;
  src: null | string | undefined;
};

export function CoverPicturePreload({
  entry,
  media,
  sizes,
  src,
}: CoverImagePreloadProps & { entry: null | ResolvedImageEntry }) {
  if (!src) return null;

  const best = entryPictureSources(entry, {
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

  const href = srcSetPreloadUrl(best.props.srcSet) ?? src;

  preload(href, {
    as: "image",
    fetchPriority: "high",
    imageSizes: best.props.sizes,
    imageSrcSet: best.props.srcSet,
    type: best.props.type,
    ...(media ? { media } : {}),
  });
  return null;
}
