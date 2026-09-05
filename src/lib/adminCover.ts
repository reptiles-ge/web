import { isPlaceholderMedia } from "@/lib/speciesContent";

export type AdminCoverRole = "cover" | "desktop" | "mobile";
export type AdminCovers = {
  desktopSrc: string;
  mobileSrc: string;
  split: boolean;
};

export type CoverTarget = "both" | "desktop" | "mobile";

export function adminCoverRoles(
  src: string,
  covers: AdminCovers,
): AdminCoverRole[] {
  if (!src) return [];
  const isDesktop = src === covers.desktopSrc;
  const isMobile = src === covers.mobileSrc;
  if (!isDesktop && !isMobile) return [];
  if (isDesktop && isMobile) return ["cover"];
  if (isDesktop) return ["desktop"];
  return ["mobile"];
}

export function resolveAdminCovers(
  image: string,
  mobileImage: string,
): AdminCovers {
  const desktopSrc = isPlaceholderMedia(image) ? "" : image;
  const mobileOnly = isPlaceholderMedia(mobileImage) ? "" : mobileImage;
  const mobileSrc = mobileOnly || desktopSrc;
  return {
    desktopSrc,
    mobileSrc,
    split: Boolean(desktopSrc && mobileOnly && desktopSrc !== mobileOnly),
  };
}
