export const siteConfig = {
  name: "Reptiles",
  shortName: "Reptiles",
  title: "Reptiles — საქართველოს ქვეწარმავლების ატლასი",
  description:
    "აღმოაჩინე, გაიგე და დაიცავი საქართველოს ქვეწარმავლები. ორენოვანი ციფრული ატლასი სახეობების პროფილებით, რეგიონალური რუკებით, შხამიანი გველების გიდითა და ველის ფოტოგრაფიით.",
  email: "nika@shamiladze.com",
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
    "გველხოკერა",
    "Pseudopus apodus",
    "წენგოსფერი მცურავი",
    "Platyceps najadum",
    "კატისთვალა",
    "Telescopus fallax",
    "ბიოლოგია",
    "კონსერვაცია",
    "Georgia reptiles",
    "venomous snakes Georgia",
    "Reptiles",
  ],
  editor: {
    name: "Nika Shamiladze",
    nameKa: "ნიკა შამილაძე",
    initials: "NS",
    email: "nika@shamiladze.com",
    image: "/images/editor/nika-shamiladze.jpg",
    path: "/about",
    sameAs: [] as readonly string[],
  },
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

export function editorDisplayName(locale: string) {
  return locale === "ka" ? siteConfig.editor.nameKa : siteConfig.editor.name;
}

export function editorPersonJsonLd(
  locale: string,
  jobTitle: string,
  options?: { includeImage?: boolean },
): Record<string, unknown> {
  const { editor } = siteConfig;
  const personUrl = absoluteUrl(localePath(locale, editor.path));
  const includeImage = options?.includeImage !== false;

  return {
    "@type": "Person",
    name: editorDisplayName(locale),
    alternateName: locale === "ka" ? editor.name : editor.nameKa,
    jobTitle,
    email: editor.email,
    url: personUrl,
    ...(includeImage ? { image: absoluteImageUrl(editor.image) } : {}),
    worksFor: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    ...(editor.sameAs.length > 0 ? { sameAs: [...editor.sameAs] } : {}),
  };
}
