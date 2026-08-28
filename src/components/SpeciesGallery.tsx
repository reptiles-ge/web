"use client";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { PhotoCreditCaption } from "@/components/PhotoCreditCaption";
import { hasPhotoCredit, type GalleryImage } from "@/data/species";
import { trackEvent } from "@/lib/analytics";
import { speciesPhotoAlt } from "@/lib/speciesMeta";
import { SPECIES_SECTION_IDS } from "@/lib/toc";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type SpeciesGalleryProps = {
  images: GalleryImage[];
  name: string;
  scientificName: string;
  location: string;
  tone?: "background" | "surface";
  speciesId: string;
};

export function SpeciesGallery({
  images,
  name,
  scientificName,
  location,
  tone = "background",
  speciesId,
}: SpeciesGalleryProps) {
  const t = useTranslations("profile");
  const photos = images.filter((item) => Boolean(item.src));
  const [active, setActive] = useState<number | null>(null);
  const opened = useRef(false);

  useEffect(() => {
    if (active === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowLeft") {
        setActive((current) =>
          current === null
            ? null
            : (current - 1 + photos.length) % photos.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActive((current) =>
          current === null ? null : (current + 1) % photos.length,
        );
      }
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, photos.length]);

  if (photos.length === 0) return null;

  const activePhoto = active !== null ? photos[active] : null;

  return (
    <>
      <section
        className={`py-24 lg:py-32 ${
          tone === "surface" ? "bg-surface" : "bg-background"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            {t("gallery")}
          </p>
          <AnchoredHeading
            id={SPECIES_SECTION_IDS.gallery}
            slugSource={`${name} ${t("galleryTitle")}`}
            className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]"
            anchorLabel={t("anchorLink")}
          >
            {name} {t("galleryTitle")}
          </AnchoredHeading>

          <div
            className={`mt-14 grid gap-3 sm:gap-4 ${
              photos.length === 1
                ? "grid-cols-1"
                : photos.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3"
            }`}
          >
            {photos.map((photo, index) => {
              const featured = photos.length >= 3 && index === 0;
              const photoAlt = speciesPhotoAlt(
                name,
                scientificName,
                location,
                photo.credit,
              );
              return (
                <figure
                  key={`${photo.src}-${index}`}
                  className={`group relative overflow-hidden rounded-[24px] bg-ink ${
                    featured
                      ? "col-span-2 aspect-[16/10] md:col-span-3"
                      : "aspect-[4/5]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (!opened.current) {
                        opened.current = true;
                        trackEvent("gallery_open", {
                          species_id: speciesId,
                          image_count: photos.length,
                          image_index: index,
                        });
                      }
                      setActive(index);
                    }}
                    className="absolute inset-0 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    aria-label={photoAlt}
                  >
                    <Image
                      src={photo.src}
                      alt={photoAlt}
                      fill
                      sizes={
                        featured
                          ? "100vw"
                          : "(max-width: 768px) 50vw, 33vw"
                      }
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20" />
                    {!hasPhotoCredit(photo.credit) ? (
                      <span className="absolute bottom-4 left-4 z-[1] font-display text-[13px] text-white/0 group-hover:text-white/80">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    ) : null}
                  </button>
                  <PhotoCreditCaption
                    credit={photo.credit}
                    variant="thumb"
                    speciesId={speciesId}
                  />
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {active !== null && activePhoto ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92"
          role="dialog"
          aria-modal="true"
          aria-label={t("gallery")}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-5 top-5 z-10 rounded-full border border-white/15 p-2.5 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label={t("close")}
          >
            <X className="size-5" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActive((current) =>
                    current === null
                      ? null
                      : (current - 1 + photos.length) % photos.length,
                  );
                }}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 p-2.5 text-white/80 hover:bg-white/10 hover:text-white sm:left-6"
                aria-label={t("prevPhoto")}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActive((current) =>
                    current === null ? null : (current + 1) % photos.length,
                  );
                }}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 p-2.5 text-white/80 hover:bg-white/10 hover:text-white sm:right-6"
                aria-label={t("nextPhoto")}
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}

          <div
            className="relative mx-auto flex h-[78svh] w-[min(92vw,1100px)] flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-0 flex-1">
              <Image
                src={activePhoto.src}
                alt={speciesPhotoAlt(
                  name,
                  scientificName,
                  location,
                  activePhoto.credit,
                )}
                fill
                sizes="92vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex shrink-0 flex-col items-center gap-1.5 pt-4 pb-1">
              <PhotoCreditCaption
                credit={activePhoto.credit}
                variant="lightbox"
                speciesId={speciesId}
              />
              <p className="text-[12px] tracking-[0.2em] text-white/35">
                {active + 1} / {photos.length}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
