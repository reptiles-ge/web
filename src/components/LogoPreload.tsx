import { preload } from "react-dom";

import { LOGO_AVIF_SRCSET, LOGO_NAV_SIZE } from "@/components/Logo";

export function LogoPreload({ size = LOGO_NAV_SIZE }: { size?: number }) {
  preload("/images/logo-88.avif", {
    as: "image",
    fetchPriority: "high",
    imageSizes: `${size}px`,
    imageSrcSet: LOGO_AVIF_SRCSET,
    type: "image/avif",
  });
  return null;
}
