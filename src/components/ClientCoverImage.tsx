"use client";

import { type CoverImageProps, CoverPicture } from "@/components/CoverPicture";
import { useOptimizedImage } from "@/components/OptimizedImagesProvider";

export function ClientCoverImage(props: CoverImageProps) {
  const entry = useOptimizedImage(props.src);
  const mobileEntry = useOptimizedImage(props.mobileSrc);
  return <CoverPicture {...props} entry={entry} mobileEntry={mobileEntry} />;
}
