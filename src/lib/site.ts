import { getPathname } from "@/i18n/navigation";
import { type AppLocale, routing } from "@/i18n/routing";
import { quizHref } from "@/lib/quizzes";
import { speciesHref } from "@/lib/speciesRoutes";

export const siteConfig = {
  description:
    "საქართველოს ცხოველთა ატლასი: სახეობების პროფილები, გავრცელება და ამოცნობა. ქვეწარმავლები და შხამიანი გველები უკვე აქ არის — ქართულად და ინგლისურად.",
  language: "ka",
  locale: "ka_GE",
  name: "Reptiles",
  shortName: "Reptiles",
  title: "Reptiles — საქართველოს ცხოველთა ატლასი",
} as const;

export function absoluteImageUrl(src: string) {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return absoluteUrl(src);
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  const production =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production";

  if (fromEnv) {
    const withProtocol = fromEnv.startsWith("http")
      ? fromEnv
      : `https://${fromEnv}`;
    const cleaned = withProtocol.replace(/\/$/, "");
    if (production && isLocalhostOrigin(cleaned)) {
      return "https://reptiles.ge";
    }
    return cleaned;
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return "https://reptiles.ge";
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

type PathnameHref = Parameters<typeof getPathname>[0]["href"];

export function localeAlternates(locale: string, href: PathnameHref = "/") {
  const languages: Record<string, string> = {
    "x-default": absoluteUrl(getPathname({ href, locale: "ka" })),
  };
  for (const loc of routing.locales) {
    languages[loc] = absoluteUrl(getPathname({ href, locale: loc }));
  }

  return {
    canonical: absoluteUrl(getPathname({ href, locale: locale as AppLocale })),
    languages,
  };
}

export function localePath(locale: string, href: PathnameHref = "/") {
  return getPathname({ href, locale: locale as AppLocale });
}

export function ogImageUrlFromSrc(src: string): null | string {
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
    alt,
    height: OG_IMAGE_HEIGHT,
    type: OG_IMAGE_TYPE,
    url,
    width: OG_IMAGE_WIDTH,
  };
}

export function organizationJsonLd(options?: {
  description?: string;
}): Record<string, unknown> {
  return {
    "@id": siteEntityId("organization"),
    "@type": "Organization",
    alternateName: ["Reptiles.ge", "საქართველოს ცხოველთა ატლასი"],
    logo: {
      "@type": "ImageObject",
      url: `${CDN_BASE}/logo.webp`,
    },
    name: siteConfig.name,
    url: absoluteUrl("/"),
    ...(options?.description ? { description: options.description } : {}),
  };
}

export function quizAlternates(locale: AppLocale, id: string) {
  const languages: Record<string, string> = {
    "x-default": quizPageUrl("ka", id),
  };
  for (const loc of routing.locales) {
    languages[loc] = quizPageUrl(loc, id);
  }
  return {
    canonical: quizPageUrl(locale, id),
    languages,
  };
}

export function quizPageUrl(locale: AppLocale, id: string) {
  return absoluteUrl(getPathname({ href: quizHref(id, locale), locale }));
}

export function siteEntityId(fragment: "organization" | "website") {
  return `${getSiteUrl()}/#${fragment}`;
}

export function speciesAlternates(locale: AppLocale, id: string) {
  const languages: Record<string, string> = {
    "x-default": speciesPageUrl("ka", id),
  };
  for (const loc of routing.locales) {
    languages[loc] = speciesPageUrl(loc, id);
  }
  return {
    canonical: speciesPageUrl(locale, id),
    languages,
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

export function speciesPageUrl(locale: AppLocale, id: string) {
  return absoluteUrl(getPathname({ href: speciesHref(id, locale), locale }));
}

export function websiteJsonLd(options: {
  description: string;
  searchUrlTemplate?: string;
}): Record<string, unknown> {
  return {
    "@id": siteEntityId("website"),
    "@type": "WebSite",
    description: options.description,
    inLanguage: [...routing.locales],
    name: siteConfig.name,
    publisher: { "@id": siteEntityId("organization") },
    url: absoluteUrl("/"),
    ...(options.searchUrlTemplate
      ? {
          potentialAction: {
            "@type": "SearchAction",
            "query-input": "required name=search_term_string",
            target: {
              "@type": "EntryPoint",
              urlTemplate: options.searchUrlTemplate,
            },
          },
        }
      : {}),
  };
}

function isLocalhostOrigin(url: string) {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]"
    );
  } catch {
    return false;
  }
}

function isPlaceholderOgSrc(src: string) {
  return PLACEHOLDER_OG_MARKERS.some((marker) => src.includes(marker));
}

function storageKeyFromSrc(src: string): null | string {
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
