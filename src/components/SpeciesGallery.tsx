import { getTranslations } from "next-intl/server";

import type { GalleryImage } from "@/data/speciesTypes";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { PhotoCreditCaption } from "@/components/PhotoCreditCaption";
import {
  GalleryOpenButton,
  SpeciesGalleryLightbox,
} from "@/components/SpeciesGalleryLightbox";
import {
  optimizedEntry,
  optimizedImgSrc,
  pictureSources,
} from "@/data/optimizedImages";
import { hasPhotoCredit } from "@/data/speciesMedia";
import { cn } from "@/lib/cn";
import {
  GALLERY_LIGHTBOX_SIZES,
  galleryFeaturedSizes,
  galleryThumbSizes,
} from "@/lib/imageSizes";
import { speciesPhotoAlt } from "@/lib/speciesMeta";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type SpeciesGalleryProps = {
  images: GalleryImage[];
  location: string;
  name: string;
  scientificName: string;
  speciesId: string;
  tone?: "background" | "surface";
};

export async function SpeciesGallery({
  images,
  location,
  name,
  scientificName,
  speciesId,
  tone = "background",
}: SpeciesGalleryProps) {
  const t = await getTranslations("profile");
  const photos = images.filter((item) => Boolean(item.src));

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
      slides={slides}
      speciesId={speciesId}
    >
      <section
        className={cn(
          "py-24 lg:py-32",
          tone === "surface" ? "bg-surface" : "bg-background",
        )}
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
            {t("gallery")}
          </p>
          <AnchoredHeading
            anchorLabel={t("anchorLink")}
            className="mt-5 font-display text-display-title"
            id={SPECIES_SECTION_IDS.gallery}
            slugSource={`${name} ${t("galleryTitle")}`}
          >
            {name} {t("galleryTitle")}
          </AnchoredHeading>

          <div
            className={cn(
              "mt-14 grid gap-3 sm:gap-4",
              photos.length === 1
                ? "grid-cols-1"
                : photos.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3",
            )}
          >
            {photos.map((photo, index) => {
              const featured = photos.length >= 3 && index === 0;
              const photoAlt = slides[index].alt;
              const entry = optimizedEntry(photo.src);
              const sizes = featured ? featuredSizes : thumbSizes;
              return (
                <figure
                  className={cn(
                    "group relative overflow-hidden rounded-card bg-ink",
                    featured
                      ? "col-span-2 aspect-16/10 md:col-span-3"
                      : "aspect-4/5",
                  )}
                  key={photo.src}
                >
                  <GalleryOpenButton alt={photoAlt} index={index}>
                    <picture className="media-placeholder absolute inset-0 block size-full">
                      {pictureSources(photo.src, { sizes }).map((source) => (
                        <source key={source.key} {...source.props} />
                      ))}
                      <img
                        alt={photoAlt}
                        className="absolute inset-0 size-full object-cover text-transparent"
                        decoding="async"
                        height={entry?.height}
                        loading="lazy"
                        sizes={sizes}
                        src={optimizedImgSrc(photo.src, featured ? 800 : 400)}
                        width={entry?.width}
                      />
                    </picture>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20" />
                    {!hasPhotoCredit(photo.credit) ? (
                      <span className="absolute bottom-4 left-4 z-1 font-display text-[13px] text-white/0 group-hover:text-white/80">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    ) : null}
                  </GalleryOpenButton>
                  <PhotoCreditCaption
                    credit={photo.credit}
                    photoConfidence={photo.photoConfidence}
                    speciesId={speciesId}
                    variant="thumb"
                  />
                </figure>
              );
            })}
          </div>
        </div>
      </section>
    </SpeciesGalleryLightbox>
  );
}
