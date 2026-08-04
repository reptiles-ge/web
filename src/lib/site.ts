export const siteConfig = {
  name: "Reptiles",
  shortName: "Reptiles",
  title: "Reptiles — საქართველოს ქვეწარმავლების ატლასი",
  description:
    "აღმოაჩინე, გაიგე და დაიცავი საქართველოს ქვეწარმავლები. ორენოვანი ციფრული ატლასი სახეობების პროფილებით, რეგიონალური რუკებით, შხამიანი გველების გიდითა და ველის ფოტოგრაფიით.",
  locale: "ka_GE",
  language: "ka",
  keywords: [
    "ქვეწარმავლები",
    "საქართველო",
    "კავკასია",
    "ატლასი",
    "შხამიანი გველები საქართველოში",
    "შხამიანი გველები",
    "გველგესლა",
    "Vipera dinniki",
    "დინიკის გველგესლა",
    "გიურზა",
    "Macrovipera lebetina",
    "კავკასიური გველგესლა",
    "Vipera kaznakovi",
    "ცხვირრქოსანი გველგესლა",
    "Vipera ammodytes",
    "დარევსკის გველგესლა",
    "Vipera darevskii",
    "ველის გველგესლა",
    "Vipera renardi",
    "სტეპის გველგესლა",
    "გველხოკერა",
    "Pseudopus apodus",
    "წენგოსფერი მცურავი",
    "Platyceps najadum",
    "სახეებიანი მცურავი",
    "Elaphe dione",
    "კატისთვალა",
    "Telescopus fallax",
    "ბიოლოგია",
    "კონსერვაცია",
    "Georgia reptiles",
    "venomous snakes Georgia",
    "Reptiles",
  ],
} as const;

export function getSiteUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

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

export function cdnOgImageUrl(speciesId: string) {
  return `${CDN_BASE}/og/${speciesId}.webp`;
}

const localOgSpeciesIds = new Set([
  "natrix-natrix",
  "telescopus-fallax",
  "elaphe-dione",
  "vipera-darevskii",
  "vipera-renardi",
]);

export function speciesOgImageUrl(speciesId: string) {
  if (localOgSpeciesIds.has(speciesId)) {
    return absoluteUrl(`/images/og/${speciesId}.jpg`);
  }
  return cdnOgImageUrl(speciesId);
}

export function localePath(locale: string, path = "/") {
  const normalized =
    !path || path === "/"
      ? "/"
      : path.startsWith("/")
        ? path
        : `/${path}`;

  if (locale === "ka") return normalized;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function localeAlternates(locale: string, path = "/") {
  const ka = absoluteUrl(localePath("ka", path));
  const en = absoluteUrl(localePath("en", path));

  return {
    canonical: absoluteUrl(localePath(locale, path)),
    languages: {
      ka,
      en,
      "x-default": ka,
    },
  };
}

export function organizationJsonLd(options?: {
  description?: string;
}): Record<string, unknown> {
  return {
    "@type": "Organization",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    logo: `${CDN_BASE}/logo.webp`,
    ...(options?.description ? { description: options.description } : {}),
  };
}
