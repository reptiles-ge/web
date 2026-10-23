import matter from "gray-matter";

import type { NewsArticle, NewsPhoto } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";

import {
  newsKaFrontmatterSchema,
  newsTranslationFrontmatterSchema,
} from "@/lib/newsFrontmatter";
import { newsBodyStart, parseNewsBody } from "@/lib/newsMdx";

export type NewsMdxFile = { path: string; raw: string };

export type NewsMdxResult = {
  article?: NewsArticle;
  errors: string[];
  heroImageException?: string;
};

const translationLocales = ["en", "ru", "tr"] as const;

export function newsArticleFromMdx(
  slug: string,
  files: Partial<Record<AppLocale, NewsMdxFile>>,
): NewsMdxResult {
  const errors: string[] = [];
  const read = (file: NewsMdxFile) => {
    const start = newsBodyStart(file.raw);
    return {
      data: matter(file.raw).data,
      sections: parseNewsBody(file.raw.slice(start), start).sections,
    };
  };

  if (!files.ka) return { errors: [`${slug}: missing ka.mdx`] };
  const ka = read(files.ka);
  const parsed = newsKaFrontmatterSchema.safeParse(ka.data);
  if (!parsed.success)
    return { errors: [`${files.ka.path}: ${parsed.error.message}`] };
  const fm = parsed.data;
  if (fm.slug !== slug)
    errors.push(
      `${files.ka.path}: folder/slug mismatch: ${slug} vs ${fm.slug}`,
    );

  const toPhoto = ({ alt, ...photo }: typeof fm.image & {}): NewsPhoto => ({
    ...photo,
    alt: { ka: alt },
  });
  const image = fm.image && toPhoto(fm.image);
  const gallery = fm.gallery?.map(toPhoto);
  const photos = new Map(
    [...(image ? [image] : []), ...(gallery ?? [])].map((photo) => [
      photo.src,
      photo,
    ]),
  );

  const copy = {
    ka: {
      dek: fm.dek,
      lead: fm.lead,
      metaDescription: fm.metaDescription,
      metaTitle: fm.metaTitle,
      sections: ka.sections,
      title: fm.title,
    },
  } as NewsArticle["copy"];

  for (const locale of translationLocales) {
    const file = files[locale];
    if (!file) continue;
    const translation = read(file);
    const result = newsTranslationFrontmatterSchema.safeParse(translation.data);
    if (!result.success) {
      errors.push(`${file.path}: ${result.error.message}`);
      continue;
    }
    const { gallery: altGallery, image: altImage, ...text } = result.data;
    for (const overlay of [
      ...(altImage ? [altImage] : []),
      ...(altGallery ?? []),
    ]) {
      const photo = photos.get(overlay.src);
      if (photo) photo.alt[locale] = overlay.alt;
      else errors.push(`${file.path}: no ka photo for ${overlay.src}`);
    }
    copy[locale] = { ...text, sections: translation.sections };
  }

  return {
    article: {
      copy,
      ...(gallery ? { gallery } : {}),
      id: slug,
      ...(image ? { image } : {}),
      publishedAt: fm.publishedAt,
      relatedHubIds: fm.relatedHubIds,
      relatedRegionIds: fm.relatedRegionIds,
      relatedSpeciesIds: fm.relatedSpeciesIds,
      ...(fm.series ? { series: fm.series } : {}),
      slug,
      sources: fm.sources,
      status: fm.status,
      ...(fm.updatedAt ? { updatedAt: fm.updatedAt } : {}),
    },
    errors,
    ...(fm.heroImageException
      ? { heroImageException: fm.heroImageException }
      : {}),
  };
}
