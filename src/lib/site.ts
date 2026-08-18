import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { speciesHref } from "@/lib/speciesRoutes";

export const siteConfig = {
  name: "Reptiles",
  shortName: "Reptiles",
  title: "Reptiles — საქართველოს ქვეწარმავლების ატლასი",
  description:
    "საქართველოს ქვეწარმავლები — სახეობების პროფილები, გავრცელება, შხამიანი გველები და საველე ფოტოები. ქართულად და ინგლისურად.",
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

const CDN_BASE = "https://cdn.reptiles.ge";

const cdnOgJpgSpeciesIds = new Set([
  "elaphe-dione",
  "vipera-darevskii",
  "vipera-renardi",
  "vipera-transcaucasiana",
  "zamenis-longissimus",
]);

export function cdnOgExt(speciesId: string): "webp" | "jpg" {
  return cdnOgJpgSpeciesIds.has(speciesId) ? "jpg" : "webp";
}

export function cdnOgImageUrl(speciesId: string) {
  return `${CDN_BASE}/og/${speciesId}.${cdnOgExt(speciesId)}`;
}

export const cdnOgSpeciesIds = new Set([
  "vipera-dinniki",
  "macrovipera-lebetina",
  "vipera-kaznakovi",
  "pseudopus-apodus",
  "coronella-austriaca",
  "elaphe-urartica",
  "natrix-tessellata",
  "dolichophis-schmidti",
  "platyceps-najadum",
  "natrix-natrix",
  "telescopus-fallax",
  "elaphe-dione",
  "vipera-darevskii",
  "vipera-renardi",
  "vipera-transcaucasiana",
  "zamenis-longissimus",
]);

const missingHeroSpeciesIds = new Set([
  "darevskia-alpina",
  "darevskia-valentini",
  "dolichophis-caspius",
]);

export function speciesOgImageUrl(
  speciesId: string,
  fallbackImageSrc?: string,
) {
  if (cdnOgSpeciesIds.has(speciesId)) {
    return cdnOgImageUrl(speciesId);
  }
  if (fallbackImageSrc?.startsWith("/")) {
    return absoluteUrl(fallbackImageSrc);
  }
  if (fallbackImageSrc && !missingHeroSpeciesIds.has(speciesId)) {
    return absoluteImageUrl(fallbackImageSrc);
  }
  return cdnOgImageUrl("vipera-dinniki");
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
