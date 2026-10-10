import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";
import type { CreditAuthorPhoto } from "@/lib/creditAuthors";

import { AuthorGalleryGrid } from "@/components/AuthorGalleryGrid";
import {
  GalleryOpenButton,
  SpeciesGalleryLightbox,
} from "@/components/SpeciesGalleryLightbox";
import {
  optimizedEntry,
  optimizedImgSrc,
  pictureSources,
} from "@/data/optimizedImages";
import { getSpeciesById } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { getCreditAuthorGroupStats } from "@/lib/creditAuthors";
import { ANIMAL_GROUP_TO_HUB } from "@/lib/groupHubs";
import { GALLERY_LIGHTBOX_SIZES } from "@/lib/imageSizes";
import { speciesHref } from "@/lib/speciesRoutes";

const TILE_SIZES = "(max-width: 1023px) 50vw, 330px";

export async function AuthorGallery({
  locale,
  photos,
}: {
  locale: AppLocale;
  photos: CreditAuthorPhoto[];
}) {
  if (photos.length === 0) return null;
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "author" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  const slides = photos.flatMap((photo) => {
    const species = getSpeciesById(photo.speciesId);
    if (!species) return [];
    const localized = localizeSpecies(species, locale);
    const entry = optimizedEntry(photo.src);
    const href = speciesHref(photo.speciesId, locale);
    return [
      {
        alt: photo.credit?.location?.trim()
          ? `${localized.commonName} (${localized.scientificName}) — ${photo.credit.location.trim()}`
          : `${localized.commonName} (${localized.scientificName})`,
        credit: photo.credit,
        group: ANIMAL_GROUP_TO_HUB[getSpeciesAtlasMeta(photo.speciesId).group],
        height: entry?.height,
        href,
        name: localized.commonName,
        photo,
        sources: pictureSources(photo.src, { sizes: GALLERY_LIGHTBOX_SIZES }),
        src: optimizedImgSrc(photo.src, 1200),
        subject: { href, name: localized.commonName },
        width: entry?.width,
      },
    ];
  });
  const stats = getCreditAuthorGroupStats(photos);
  const photoCount = (count: number, label: string) =>
    `${count} ${t("statPhotos")} · ${label}`;

  return (
    <SpeciesGalleryLightbox
      closeLabel={t("close")}
      galleryLabel={t("gallery")}
      nextLabel={t("nextPhoto")}
      prevLabel={t("prevPhoto")}
      slides={slides}
    >
      <AuthorGalleryGrid
        filterLabel={t("galleryFilterLabel")}
        filters={[
          {
            count: slides.length,
            countLabel: photoCount(slides.length, t("galleryAllGroups")),
            id: "all",
            label: t("index.all"),
            showAllLabel: t("galleryShowAll", { count: slides.length }),
          },
          ...stats.map((stat) => ({
            count: stat.photos,
            countLabel: photoCount(stat.photos, tNav(stat.hub)),
            id: stat.hub,
            label: tNav(stat.hub),
            showAllLabel: t("galleryShowAll", { count: stat.photos }),
          })),
        ]}
        heading={
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {t("gallery")}
            </p>
            <h2 className="mt-3 font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] text-foreground lg:mt-3.5 lg:text-[40px] lg:leading-[1.1]">
              {t("galleryTitle")}
            </h2>
          </div>
        }
        items={slides.map((slide, index) => {
          const entry = optimizedEntry(slide.photo.src);
          return {
            group: slide.group,
            id: slide.photo.src,
            node: (
              <div className="group relative aspect-square overflow-hidden rounded-[18px] bg-ink lg:rounded-[24px]">
                <GalleryOpenButton alt={slide.alt} index={index}>
                  <picture className="media-placeholder absolute inset-0 block size-full">
                    {pictureSources(slide.photo.src, {
                      sizes: TILE_SIZES,
                    }).map((source) => (
                      <source key={source.key} {...source.props} />
                    ))}
                    <img
                      alt={slide.alt}
                      className="absolute inset-0 size-full object-cover text-transparent transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
                      decoding="async"
                      height={entry?.height}
                      loading={index < 5 ? "eager" : "lazy"}
                      sizes={TILE_SIZES}
                      src={optimizedImgSrc(slide.photo.src, 800)}
                      width={entry?.width}
                    />
                  </picture>
                  <span className="pointer-events-none absolute bottom-2.5 left-2.5 inline-flex h-[30px] max-w-[calc(100%-1.25rem)] items-center truncate rounded-full bg-ink/72 px-3 text-[12.5px] font-medium text-white lg:bottom-3 lg:left-3 lg:max-w-[calc(100%-1.5rem)]">
                    <span className="truncate">{slide.name}</span>
                  </span>
                </GalleryOpenButton>
              </div>
            ),
          };
        })}
      />
    </SpeciesGalleryLightbox>
  );
}
