import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { quizHref } from "@/lib/quizzes";
import { speciesHref } from "@/lib/speciesRoutes";

export const siteConfig = {
  name: "Reptiles",
  shortName: "Reptiles",
  title: "Reptiles — საქართველოს ცხოველთა ატლასი",
  description:
    "საქართველოს ცხოველთა ატლასი: სახეობების პროფილები, გავრცელება და ამოცნობა. ქვეწარმავლები და შხამიანი გველები უკვე აქ არის — ქართულად და ინგლისურად.",
  locale: "ka_GE",
  language: "ka",
} as const;

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;

  if (fromEnv) {
    const withProtocol = fromEnv.startsWith("http")
      ? fromEnv
      : `https://${fromEnv}`;
    return withProtocol.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return "https://reptiles.ge";
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function absoluteImageUrl(src: string) {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return absoluteUrl(src);
}

export const CDN_BASE = "https://cdn.reptiles.ge";

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_TYPE = "image/jpeg";
export const SITE_OG_IMAGE_URL = `${CDN_BASE}/og/hero-img.jpg`;
export const FALLBACK_OG_IMAGE_URL = `${CDN_BASE}/og/vipera-dinnik.jpg`;

const PLACEHOLDER_OG_MARKERS = [
  "species-placeholder.png",
  "species-placeholder.svg",
  "species-placeholder.jpg",
];

function isPlaceholderOgSrc(src: string) {
  return PLACEHOLDER_OG_MARKERS.some((marker) => src.includes(marker));
}

function storageKeyFromSrc(src: string): string | null {
  if (!src || isPlaceholderOgSrc(src)) return null;
  if (src.startsWith(`${CDN_BASE}/`)) {
    const key = decodeURIComponent(src.slice(CDN_BASE.length + 1));
    if (!key || key.startsWith("og/") || key.startsWith("optimized/")) {
      return null;
    }
    return key;
  }
  if (src.startsWith("/")) return src.slice(1);
  return null;
}

export function ogImageUrlFromSrc(src: string): string | null {
  const key = storageKeyFromSrc(src);
  if (!key) return null;
  const lastSlash = key.lastIndexOf("/");
  const directory = lastSlash === -1 ? "" : key.slice(0, lastSlash);
  const fileName = lastSlash === -1 ? key : key.slice(lastSlash + 1);
  const lastDot = fileName.lastIndexOf(".");
  const baseName = lastDot > 0 ? fileName.slice(0, lastDot) : fileName;
  if (!baseName) return null;
  return directory === ""
    ? `${CDN_BASE}/og/${baseName}.jpg`
    : `${CDN_BASE}/og/${directory}/${baseName}.jpg`;
}

export function openGraphJpeg(url: string, alt: string) {
  return {
    url,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    type: OG_IMAGE_TYPE,
    alt,
  };
}

export function speciesOgImageUrl(
  _speciesId: string,
  fallbackImageSrc?: string,
) {
  if (fallbackImageSrc) {
    const fromPipeline = ogImageUrlFromSrc(fallbackImageSrc);
    if (fromPipeline) return fromPipeline;
    if (
      fallbackImageSrc.startsWith("http://") ||
      fallbackImageSrc.startsWith("https://")
    ) {
      return absoluteImageUrl(fallbackImageSrc);
    }
    if (
      fallbackImageSrc.startsWith("/") &&
      !isPlaceholderOgSrc(fallbackImageSrc)
    ) {
      return absoluteUrl(fallbackImageSrc);
    }
  }
  return FALLBACK_OG_IMAGE_URL;
}

type PathnameHref = Parameters<typeof getPathname>[0]["href"];

export function localePath(locale: string, href: PathnameHref = "/") {
  return getPathname({ locale: locale as AppLocale, href });
}

export function localeAlternates(locale: string, href: PathnameHref = "/") {
  const ka = absoluteUrl(getPathname({ locale: "ka", href }));
  const en = absoluteUrl(getPathname({ locale: "en", href }));

  return {
    canonical: absoluteUrl(getPathname({ locale: locale as AppLocale, href })),
    languages: {
      ka,
      en,
      "x-default": ka,
    },
  };
}

export function speciesPageUrl(locale: AppLocale, id: string) {
  return absoluteUrl(getPathname({ locale, href: speciesHref(id, locale) }));
}

export function quizPageUrl(locale: AppLocale, id: string) {
  return absoluteUrl(getPathname({ locale, href: quizHref(id, locale) }));
}

export function quizAlternates(locale: AppLocale, id: string) {
  const ka = quizPageUrl("ka", id);
  const en = quizPageUrl("en", id);
  return {
    canonical: locale === "en" ? en : ka,
    languages: {
      ka,
      en,
      "x-default": ka,
    },
  };
}

export function speciesAlternates(locale: AppLocale, id: string) {
  const ka = speciesPageUrl("ka", id);
  const en = speciesPageUrl("en", id);
  return {
    canonical: locale === "en" ? en : ka,
    languages: {
      ka,
      en,
      "x-default": ka,
    },
  };
}

export function siteEntityId(fragment: "organization" | "website") {
  return `${getSiteUrl()}/#${fragment}`;
}

export function organizationJsonLd(options?: {
  description?: string;
}): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": siteEntityId("organization"),
    name: siteConfig.name,
    alternateName: ["Reptiles.ge", "საქართველოს ცხოველთა ატლასი"],
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: `${CDN_BASE}/logo.webp`,
    },
    ...(options?.description ? { description: options.description } : {}),
  };
}

export function websiteJsonLd(options: {
  description: string;
}): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": siteEntityId("website"),
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: options.description,
    inLanguage: ["ka", "en"],
    publisher: { "@id": siteEntityId("organization") },
  };
}
