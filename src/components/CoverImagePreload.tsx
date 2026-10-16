import {
  type CoverImagePreloadProps,
  CoverPicturePreload,
} from "@/components/CoverPicturePreload";
import { optimizedEntry } from "@/data/optimizedImages";

export function CoverImagePreload(props: CoverImagePreloadProps) {
  return <CoverPicturePreload {...props} entry={optimizedEntry(props.src)} />;
}
