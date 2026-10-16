import { type CoverImageProps, CoverPicture } from "@/components/CoverPicture";
import { optimizedEntry } from "@/data/optimizedImages";

export function CoverImage(props: CoverImageProps) {
  return (
    <CoverPicture
      {...props}
      entry={optimizedEntry(props.src)}
      mobileEntry={optimizedEntry(props.mobileSrc)}
    />
  );
}
