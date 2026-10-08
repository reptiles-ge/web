import { ArrowUpRight, Images } from "lucide-react";
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
  "(max-width: 1023px) calc(100vw - 3rem), (max-width: 1479px) calc((100vw - 6rem) / 2), 692px";
const MOSAIC_THUMB_SIZES =
  "(max-width: 1023px) calc((100vw - 4rem) / 2), (max-width: 1479px) calc((100vw - 8rem) / 4), 338px";

type SpeciesGalleryProps = {
  images: GalleryImage[];
  locale: AppLocale;
  location: string;
  name: string;
  scientificName: string;
  speciesId: string;
  tone?: "background" | "surface";
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
  tone = "background",
}: SpeciesGalleryProps) {
  const t = await getTranslations({ locale, namespace: "profile" });
  const photos = images.filter((item) => Boolean(item.src));
  const visiblePhotos = photos.slice(0, 5);
  const morePhoto = photos[5];

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
      <section
        className={cn(
          "py-11 lg:py-20",
          tone === "surface" ? "bg-surface" : "bg-background",
        )}
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {t("gallery")}
          </p>
          <AnchoredHeading
            anchorLabel={t("anchorLink")}
            className="mt-5 font-display text-display-title font-bold"
            id={SPECIES_SECTION_IDS.gallery}
            slugSource={`${name} ${t("galleryTitle")}`}
          >
            {name} {t("galleryTitle")}
          </AnchoredHeading>

          <div
            className={cn(
              "mt-14 grid gap-3 sm:gap-4",
              morePhoto
                ? "grid-cols-2 lg:grid-cols-4"
                : photos.length === 1
                  ? "grid-cols-1"
                  : photos.length === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-2 md:grid-cols-3",
            )}
          >
            {visiblePhotos.map((photo, index) => {
              const featured = photos.length >= 3 && index === 0;
              const photoAlt = slides[index].alt;
              const entry = optimizedEntry(photo.src);
              const sizes = morePhoto
                ? featured
                  ? MOSAIC_WIDE_SIZES
                  : MOSAIC_THUMB_SIZES
                : featured
                  ? featuredSizes
                  : thumbSizes;
              return (
                <figure
                  className={cn(
                    "group",
                    featured
                      ? morePhoto
                        ? "col-span-2"
                        : "col-span-2 md:col-span-3"
                      : "",
                  )}
                  key={photo.src}
                >
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-card bg-ink",
                      featured
                        ? morePhoto
                          ? "aspect-16/10 lg:aspect-2/1"
                          : "aspect-16/10"
                        : morePhoto
                          ? "aspect-square"
                          : "aspect-4/5",
                    )}
                  >
                    <GalleryOpenButton alt={photoAlt} index={index}>
                      <picture className="media-placeholder absolute inset-0 block size-full">
                        {pictureSources(photo.src, { sizes }).map((source) => (
                          <source key={source.key} {...source.props} />
                        ))}
                        <img
                          alt={photoAlt}
                          className="absolute inset-0 size-full object-cover text-transparent transition-transform duration-500 group-focus-within:scale-[1.03] group-hover:scale-[1.03] motion-reduce:transition-none"
                          decoding="async"
                          height={entry?.height}
                          loading="lazy"
                          sizes={sizes}
                          src={optimizedImgSrc(photo.src, featured ? 800 : 400)}
                          width={entry?.width}
                        />
                      </picture>
                      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-focus-within:bg-black/20 group-hover:bg-black/20" />
                    </GalleryOpenButton>
                  </div>
                  <GalleryPhotoFigcaption locale={locale} photo={photo} />
                </figure>
              );
            })}
            {morePhoto ? (
              <div className="group relative col-span-2 aspect-16/10 overflow-hidden rounded-card bg-ink text-white lg:aspect-2/1">
                <GalleryOpenButton
                  alt={t("galleryOpenSixth", { total: photos.length })}
                  index={5}
                >
                  <picture className="media-placeholder absolute inset-0 block size-full">
                    {pictureSources(morePhoto.src, {
                      sizes: MOSAIC_WIDE_SIZES,
                    }).map((source) => (
                      <source key={source.key} {...source.props} />
                    ))}
                    <img
                      alt=""
                      className="absolute inset-0 size-full object-cover text-transparent transition-transform duration-700 group-focus-within:scale-105 group-hover:scale-105 motion-reduce:transition-none"
                      decoding="async"
                      loading="lazy"
                      sizes={MOSAIC_WIDE_SIZES}
                      src={optimizedImgSrc(morePhoto.src, 800)}
                    />
                  </picture>
                  <span className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/15" />
                  <span className="absolute inset-0 ring-1 ring-white/20 ring-inset" />
                  <span className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7 lg:p-8">
                    <span className="flex items-start justify-between gap-4">
                      <span className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/25 backdrop-blur-sm">
                        <Images
                          aria-hidden="true"
                          className="size-5"
                          strokeWidth={1.5}
                        />
                      </span>
                      <span className="pt-2 text-[11px] font-medium tracking-[0.18em] text-white/80 uppercase">
                        {t("gallery")}
                      </span>
                    </span>
                    <span className="flex items-end justify-between gap-4">
                      <span className="flex flex-col gap-1">
                        <span className="font-display text-6xl leading-none font-bold tracking-tight sm:text-7xl">
                          +{photos.length - 5}
                        </span>
                        <span className="text-sm font-medium text-white/90 sm:text-base">
                          {t("morePhotos")}
                        </span>
                      </span>
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/15 backdrop-blur-sm transition-colors group-focus-within:bg-white/25 group-hover:bg-white/25">
                        <ArrowUpRight aria-hidden="true" className="size-5" />
                      </span>
                    </span>
                  </span>
                </GalleryOpenButton>
              </div>
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
