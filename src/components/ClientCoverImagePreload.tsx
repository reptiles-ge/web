"use client";

import {
  type CoverImagePreloadProps,
  CoverPicturePreload,
} from "@/components/CoverPicturePreload";
import { useOptimizedImage } from "@/components/OptimizedImagesProvider";

export function ClientCoverImagePreload(props: CoverImagePreloadProps) {
  const entry = useOptimizedImage(props.src);
  return <CoverPicturePreload {...props} entry={entry} />;
}
