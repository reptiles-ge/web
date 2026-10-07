import type { Metadata } from "next";

import { openGraphLocale } from "@/i18n/localeMeta";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  openGraphJpeg,
  siteConfig,
} from "@/lib/site";

type OpenGraphImage = {
  alt: string;
  height: number;
  url: string;
  width: number;
};

type PageMetadataInput = {
  description: string;
  indexable?: boolean;
  keywords?: string;
  locale: string;
  metadataTitle?: Metadata["title"];
  ogImageUrl: string;
  openGraphImage?: OpenGraphImage;
  pagePath: Parameters<typeof localePath>[1];
  title: string;
  type?: "article" | "website";
};

export function buildPageMetadata({
  description: sourceDescription,
  indexable,
  keywords,
  locale,
  metadataTitle,
  ogImageUrl,
  openGraphImage,
  pagePath,
  title,
  type = "website",
}: PageMetadataInput): Metadata {
  const path = localePath(locale, pagePath);
  const description = kaMetaDescriptionOverride(
    locale,
    path,
    sourceDescription,
  );

  return {
    alternates: localeAlternates(locale, pagePath),
    description,
    ...(keywords === undefined
      ? {}
      : {
          keywords: keywords
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
    openGraph: {
      description,
      images: [openGraphImage ?? openGraphJpeg(ogImageUrl, title)],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type,
      url: absoluteUrl(path),
    },
    ...(indexable ? { robots: { follow: true, index: true } } : {}),
    title: metadataTitle ?? title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [ogImageUrl],
      title,
    },
  };
}
