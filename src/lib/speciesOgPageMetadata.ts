import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { type AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { type localePath, speciesOgImageUrl } from "@/lib/site";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";

type SpeciesOgPageMetadataInput = {
  locale: AppLocale;
  namespace:
    "dangerousAnimals" | "riskToHumans" | "snakesInYard" | "venomousSnakes";
  ogSpeciesId: string;
  pagePath: Parameters<typeof localePath>[1];
  titleValues?: Record<string, number>;
  type?: "article" | "website";
};

export async function speciesOgPageMetadata({
  locale,
  namespace,
  ogSpeciesId,
  pagePath,
  titleValues,
  type,
}: SpeciesOgPageMetadataInput): Promise<Metadata> {
  const [t, catalog] = await Promise.all([
    getTranslations({ locale, namespace }),
    getSpeciesCatalog(locale),
  ]);
  const title = t("metaTitle", titleValues);
  return buildPageMetadata({
    description: t("metaDescription"),
    indexable: true,
    keywords: t("keywords"),
    locale,
    metadataTitle: { absolute: title },
    ogImageUrl: speciesOgImageUrl(
      ogSpeciesId,
      catalog.find((item) => item.id === ogSpeciesId)?.image,
    ),
    pagePath,
    title,
    type,
  });
}
