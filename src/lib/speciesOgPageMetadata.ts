import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { getSpeciesById } from "@/data/species";
import { type AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { type localePath, speciesOgImageUrl } from "@/lib/site";

type SpeciesOgPageMetadataInput = {
  locale: AppLocale;
  namespace: "dangerousAnimals" | "riskToHumans" | "venomousSnakes";
  ogSpeciesId: string;
  pagePath: Parameters<typeof localePath>[1];
  type?: "article" | "website";
};

export async function speciesOgPageMetadata({
  locale,
  namespace,
  ogSpeciesId,
  pagePath,
  type,
}: SpeciesOgPageMetadataInput): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  return buildPageMetadata({
    description: t("metaDescription"),
    indexable: true,
    keywords: t("keywords"),
    locale,
    ogImageUrl: speciesOgImageUrl(
      ogSpeciesId,
      getSpeciesById(ogSpeciesId)?.image,
    ),
    pagePath,
    title: t("metaTitle"),
    type,
  });
}
