import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { GalleryImage, PhotoCredit } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import {
  GalleryOpenButton,
  SpeciesGalleryLightbox,
} from "@/components/SpeciesGalleryLightbox";
import {
  creditAuthorHref,
  creditAuthorName,
  getPublishedCreditAuthorByName,
} from "@/data/creditAuthors";
import {
  optimizedEntry,
  optimizedImgSrc,
  pictureSources,
} from "@/data/optimizedImages";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { formatPhotoDate } from "@/lib/formatDate";
import {
  GALLERY_LIGHTBOX_SIZES,
  galleryFeaturedSizes,
  galleryThumbSizes,
} from "@/lib/imageSizes";
import { speciesPhotoAlt } from "@/lib/speciesMeta";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

const FIELD_RECORD_LABEL: Record<AppLocale, string> = {
  en: "Field record",
  ka: "საველე ჩანაწერი",
  ru: "Полевая фотозапись",
  tr: "Arazi kaydı",
};

const MOSAIC_WIDE_SIZES =
  "(max-width: 1023px) calc(100vw - 3rem), (max-width: 1479px) calc((100vw - 6rem) / 2), 660px";
const MOSAIC_THUMB_SIZES =
  "(max-width: 1023px) calc((100vw - 4rem) / 2), (max-width: 1479px) calc((100vw - 8rem) / 4), 318px";

type SpeciesGalleryProps = {
  images: GalleryImage[];
  locale: AppLocale;
  location: string;
  name: string;
  scientificName: string;
  speciesId: string;
};

export function GalleryPhotoFigcaption({
  locale,
  photo,
}: {
  locale: AppLocale;
  photo: GalleryImage;
}) {
  const fieldRecord =
    (photo.photoConfidence ?? photo.credit?.photoConfidence) ===
    "georgia-field";

  return (
    <GalleryPhotoCaption
      credit={photo.credit}
      fieldLabel={fieldRecord ? FIELD_RECORD_LABEL[locale] : undefined}
      locale={locale}
    />
  );
}

export async function SpeciesGallery({
  images,
  locale,
  location,
  name,
  scientificName,
  speciesId,
}: SpeciesGalleryProps) {
  const t = await getTranslations({ locale, namespace: "profile" });
  const photos = images.filter((item) => Boolean(item.src));
  const visiblePhotos = photos.slice(0, 5);
  const hasMore = photos.length > 5;
  const photographers = [
    ...new Set(
      photos
        .map((photo) => photo.credit?.photographer?.trim())
        .filter((name): name is string => Boolean(name)),
    ),
  ];
  const authorCount = photographers.length;

  if (photos.length === 0) return null;

  const featuredSizes = galleryFeaturedSizes();
  const thumbSizes = galleryThumbSizes(photos.length);
  const slides = photos.map((photo) => {
    const entry = optimizedEntry(photo.src);
    return {
      alt: speciesPhotoAlt(name, scientificName, location, photo.credit),
      credit: photo.credit,
      height: entry?.height,
      photoConfidence: photo.photoConfidence,
      sources: pictureSources(photo.src, { sizes: GALLERY_LIGHTBOX_SIZES }),
      src: optimizedImgSrc(photo.src, 1200),
      width: entry?.width,
    };
  });

  return (
    <SpeciesGalleryLightbox
      closeLabel={t("close")}
      galleryLabel={t("gallery")}
      nextLabel={t("nextPhoto")}
      prevLabel={t("prevPhoto")}
      renderAllSlides
      slides={slides}
      speciesId={speciesId}
    >
      <section className="bg-ink py-12 text-white lg:py-[76px]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-medium tracking-[0.18em] text-white/60 uppercase">
                {t("gallery")}
              </p>
              <AnchoredHeading
                anchorLabel={t("anchorLink")}
                className="mt-4 font-display text-display-title font-semibold text-white"
                id={SPECIES_SECTION_IDS.gallery}
                slugSource={`${name} ${t("galleryTitle")}`}
              >
                {t("galleryTitle")}
              </AnchoredHeading>
            </div>
            <div className="flex flex-wrap items-center gap-5 lg:pb-2">
              <span className="text-sm text-white/65">
                {t("gallerySummary", {
                  authors: authorCount,
                  photos: photos.length,
                })}
              </span>
              <a
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-[14.5px] font-medium text-white transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                data-species-gallery-src={slides[0].src}
                href={`#${SPECIES_SECTION_IDS.gallery}`}
              >
                {t("viewAllPhotos")}
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>

          <div
            className={cn(
              "mt-10 grid gap-3 sm:gap-4",
              photos.length >= 5
                ? "grid-cols-2 lg:auto-rows-[250px] lg:grid-cols-4"
                : photos.length === 1
                  ? "grid-cols-1"
                  : "grid-cols-2",
            )}
          >
            {visiblePhotos.map((photo, index) => {
              const featured = index === 0 && photos.length >= 3;
              const entry = optimizedEntry(photo.src);
              const sizes =
                photos.length >= 5
                  ? featured
                    ? MOSAIC_WIDE_SIZES
                    : MOSAIC_THUMB_SIZES
                  : featured
                    ? featuredSizes
                    : thumbSizes;
              const photographer = photo.credit?.photographer?.trim();
              const author = photographer
                ? getPublishedCreditAuthorByName(photographer)
                : undefined;
              const creditName = author
                ? creditAuthorName(author, locale)
                : photographer;
              const creditLocation = photo.credit?.location?.trim();
              return (
                <div
                  className={cn(
                    "group relative overflow-hidden bg-ink",
                    featured
                      ? "col-span-2 aspect-16/10 rounded-[30px] lg:row-span-2 lg:aspect-auto"
                      : "aspect-square rounded-[24px] lg:aspect-auto",
                  )}
                  key={photo.src}
                >
                  <GalleryOpenButton alt={slides[index].alt} index={index}>
                    <picture className="media-placeholder absolute inset-0 block size-full">
                      {pictureSources(photo.src, { sizes }).map((source) => (
                        <source key={source.key} {...source.props} />
                      ))}
                      <img
                        alt=""
                        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-focus-within:scale-[1.04] group-hover:scale-[1.04] motion-reduce:transition-none"
                        decoding="async"
                        height={entry?.height}
                        loading="lazy"
                        sizes={sizes}
                        src={optimizedImgSrc(photo.src, featured ? 800 : 400)}
                        width={entry?.width}
                      />
                    </picture>
                    {hasMore && index === 4 ? (
                      <span className="absolute inset-0 flex items-center justify-center bg-ink/60 text-[28px] font-semibold text-white">
                        +{photos.length - 5}
                      </span>
                    ) : null}
                  </GalleryOpenButton>
                  {!(hasMore && index === 4) &&
                  (creditName || creditLocation) ? (
                    <span className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-ink/70 px-2.5 py-1.5 text-[11.5px] text-white/90">
                      {creditName ? (
                        author ? (
                          <Link
                            className="pointer-events-auto rounded-sm underline decoration-white/40 underline-offset-2 transition-colors hover:text-white hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            href={creditAuthorHref(author.slug)}
                          >
                            {creditName}
                          </Link>
                        ) : (
                          creditName
                        )
                      ) : null}
                      {creditName && creditLocation ? " · " : null}
                      {creditLocation}
                    </span>
                  ) : null}
                </div>
              );
            })}
            {speciesId === "macrovipera-lebetina" ? (
              <p className="mt-5 text-[12px] leading-relaxed text-white/65">
                {photographers.map((photographer, index) => {
                  const author = getPublishedCreditAuthorByName(photographer);
                  const label = author
                    ? creditAuthorName(author, locale)
                    : photographer;
                  return (
                    <span key={photographer}>
                      {index > 0 ? " · " : null}
                      {author ? (
                        <Link
                          className="underline decoration-white/35 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
                          href={creditAuthorHref(author.slug)}
                        >
                          {label}
                        </Link>
                      ) : (
                        label
                      )}
                    </span>
                  );
                })}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </SpeciesGalleryLightbox>
  );
}

function captionLead(fieldLabel: string | undefined, placeDate: string) {
  if (fieldLabel && placeDate) return `${fieldLabel} — ${placeDate}`;
  return fieldLabel || placeDate || null;
}

function GalleryPhotoCaption({
  credit,
  fieldLabel,
  locale,
}: {
  credit?: PhotoCredit;
  fieldLabel?: string;
  locale: AppLocale;
}) {
  const location = credit?.location?.trim();
  const date = credit?.date ? formatPhotoDate(credit.date, locale) : null;
  const photographer = credit?.photographer?.trim();
  const author = photographer
    ? getPublishedCreditAuthorByName(photographer)
    : undefined;
  const photographerLabel = author
    ? creditAuthorName(author, locale)
    : photographer;
  const placeDate = [location, date].filter(Boolean).join(", ");
  const lead = captionLead(fieldLabel, placeDate);

  if (!lead && !photographerLabel) return null;

  return (
    <figcaption className="mt-3 text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]">
      {lead ? (
        <span className="font-medium text-foreground">{lead}</span>
      ) : null}
      {photographerLabel ? (
        <GalleryPhotographerCredit
          authorSlug={author?.slug}
          label={photographerLabel}
          withSeparator={Boolean(lead)}
        />
      ) : null}
    </figcaption>
  );
}

function GalleryPhotographerCredit({
  authorSlug,
  label,
  withSeparator,
}: {
  authorSlug?: string;
  label: string;
  withSeparator: boolean;
}) {
  return (
    <>
      {withSeparator ? " · " : ""}
      {authorSlug ? (
        <Link
          className="underline decoration-current/40 underline-offset-[3px] transition-colors hover:text-foreground hover:decoration-foreground"
          href={creditAuthorHref(authorSlug)}
        >
          {label}
        </Link>
      ) : (
        label
      )}
    </>
  );
}
