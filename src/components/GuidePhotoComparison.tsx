import { getTranslations } from "next-intl/server";

import type { GuideArticle } from "@/data/guideArticles";
import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import {
  GalleryOpenButton,
  SpeciesGalleryLightbox,
} from "@/components/SpeciesGalleryLightbox";
import {
  optimizedEntry,
  optimizedImgSrc,
  pictureSources,
} from "@/data/optimizedImages";
import { GALLERY_LIGHTBOX_SIZES } from "@/lib/imageSizes";

const CARD_SIZES = "(max-width: 1023px) 100vw, 420px";

export async function GuidePhotoComparison({
  article,
  locale,
}: {
  article: GuideArticle;
  locale: AppLocale;
}) {
  const comparison = article.comparison;
  const copy = article.copy[locale].comparison;
  if (!comparison || !copy) return null;

  const t = await getTranslations({ locale, namespace: "author" });
  const slides = comparison.photos.map((photo) => {
    const image = article.images?.[photo.image];
    if (!image) throw new Error(`Missing comparison image: ${photo.image}`);
    const entry = optimizedEntry(image.src);
    return {
      alt: image.alt[locale],
      credit: { photographer: photo.author, url: photo.sourceUrl },
      height: entry?.height,
      sources: pictureSources(image.src, { sizes: GALLERY_LIGHTBOX_SIZES }),
      src: optimizedImgSrc(image.src, 1200),
      width: entry?.width,
    };
  });

  return (
    <section aria-labelledby="photo-comparison" className="mt-9">
      <h2
        className="font-display text-display-card font-semibold text-foreground"
        id="photo-comparison"
      >
        {copy.heading}
      </h2>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
        {copy.intro}
      </p>
      <SpeciesGalleryLightbox
        closeLabel={t("close")}
        galleryLabel={t("gallery")}
        nextLabel={t("nextPhoto")}
        prevLabel={t("prevPhoto")}
        slides={slides}
      >
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {comparison.photos.map((photo, index) => {
            const image = article.images?.[photo.image];
            const card = copy.cards.find((item) => item.image === photo.image);
            if (!image || !card) return null;
            return (
              <figure
                className="overflow-hidden rounded-card border border-border bg-card"
                key={photo.image}
              >
                <div className="relative aspect-4/3 bg-ink">
                  <GalleryOpenButton alt={image.alt[locale]} index={index}>
                    <CoverImage
                      alt={image.alt[locale]}
                      className="object-contain"
                      priority={index === 0}
                      sizes={CARD_SIZES}
                      src={image.src}
                    />
                  </GalleryOpenButton>
                </div>
                <figcaption className="space-y-3 p-5">
                  <h3 className="font-display text-[20px] font-semibold text-foreground">
                    {card.label}
                  </h3>
                  <p className="text-[13px] text-muted-foreground italic">
                    {card.taxon}
                  </p>
                  <ul className="list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-foreground/85">
                    {card.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {card.caveat}
                  </p>
                  <p className="border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground">
                    <a
                      className="underline underline-offset-2"
                      href={photo.sourceUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {photo.author}
                    </a>
                    {" · "}
                    <a
                      className="underline underline-offset-2"
                      href={photo.licenseUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {photo.license}
                    </a>
                    {" · "}
                    {photo.changes[locale]}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </SpeciesGalleryLightbox>
      <p className="mt-4 text-[13px] text-muted-foreground">{copy.scaleNote}</p>
    </section>
  );
}
