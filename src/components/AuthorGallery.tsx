import { getTranslations } from "next-intl/server";

import type { CreditAuthorPhoto } from "@/lib/creditAuthors";
import type { AppLocale } from "@/i18n/routing";

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
import { Link } from "@/i18n/navigation";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { cn } from "@/lib/cn";
import {
  GALLERY_LIGHTBOX_SIZES,
  galleryFeaturedSizes,
  galleryThumbSizes,
} from "@/lib/imageSizes";
import { speciesHref } from "@/lib/speciesRoutes";

export async function AuthorGallery({
  locale,
  photos,
}: {
  locale: AppLocale;
  photos: CreditAuthorPhoto[];
}) {
  const t = await getTranslations("author");
  if (photos.length === 0) return null;

  const featuredSizes = galleryFeaturedSizes();
  const thumbSizes = galleryThumbSizes(photos.length);
  const slides = photos.flatMap((photo) => {
    const species = getSpeciesById(photo.speciesId);
    if (!species) return [];
    const localized = localizeSpecies(species, locale);
    const entry = optimizedEntry(photo.src);
    const href = speciesHref(photo.speciesId, locale);
    return [
      {
        alt: `${localized.commonName} (${localized.scientificName})`,
        credit: photo.credit,
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

  return (
    <SpeciesGalleryLightbox
      closeLabel={t("close")}
      galleryLabel={t("gallery")}
      nextLabel={t("nextPhoto")}
      prevLabel={t("prevPhoto")}
      slides={slides}
    >
      <div
        className={cn(
          "mt-10 grid gap-x-3 gap-y-8 sm:mt-12 sm:gap-x-4 sm:gap-y-10",
          photos.length === 1
            ? "grid-cols-1"
            : photos.length === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-2 md:grid-cols-3",
        )}
      >
        {slides.map((slide, index) => {
          const featured = slides.length >= 3 && index === 0;
          const entry = optimizedEntry(slide.photo.src);
          const sizes = featured ? featuredSizes : thumbSizes;
          return (
            <figure
              className={cn(featured && "col-span-2 md:col-span-3")}
              key={slide.photo.src}
            >
              <div
                className={cn(
                  "group relative overflow-hidden rounded-card bg-ink",
                  featured ? "aspect-16/10" : "aspect-4/5",
                )}
              >
                <GalleryOpenButton alt={slide.alt} index={index}>
                  <picture className="media-placeholder absolute inset-0 block size-full">
                    {pictureSources(slide.photo.src, { sizes }).map(
                      (source) => (
                        <source key={source.key} {...source.props} />
                      ),
                    )}
                    <img
                      alt=""
                      className="absolute inset-0 size-full object-cover text-transparent"
                      decoding="async"
                      height={entry?.height}
                      loading={index < 3 ? "eager" : "lazy"}
                      sizes={sizes}
                      src={optimizedImgSrc(
                        slide.photo.src,
                        featured ? 800 : 400,
                      )}
                      width={entry?.width}
                    />
                  </picture>
                </GalleryOpenButton>
              </div>
              <figcaption className="mt-3">
                <Link
                  className="inline-flex min-h-6 items-center font-display text-[14px] font-medium text-foreground/80 transition-colors hover:text-foreground"
                  href={slide.href}
                >
                  {slide.name}
                </Link>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </SpeciesGalleryLightbox>
  );
}
