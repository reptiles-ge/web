import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { openGraphLocale } from "@/i18n/localeMeta";
import { type AppLocale } from "@/i18n/routing";
import { openGraphJpeg, SITE_OG_IMAGE_URL, siteConfig } from "@/lib/site";

export async function notFoundMetadata(locale: AppLocale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "notFound" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const ogImage = openGraphJpeg(SITE_OG_IMAGE_URL, title);

  return {
    description,
    openGraph: {
      description,
      images: [ogImage],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type: "website",
    },
    robots: {
      follow: true,
      googleBot: { follow: true, index: false },
      index: false,
    },
    title: {
      absolute: title,
    },
    twitter: {
      card: "summary_large_image",
      description,
      images: [SITE_OG_IMAGE_URL],
      title,
    },
  };
}
