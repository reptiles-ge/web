"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { PhotoCreditCaption } from "@/components/PhotoCreditCaption";
import { pictureSources } from "@/data/optimizedImages";
import { type GalleryImage, hasPhotoCredit } from "@/data/species";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
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

export function SpeciesGallery({
  images,
  location,
  name,
  scientificName,
  speciesId,
  tone = "background",
}: SpeciesGalleryProps) {
  const t = useTranslations("profile");
  const photos = images.filter((item) => Boolean(item.src));
  const [active, setActive] = useState<null | number>(null);
  const opened = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const restoreIndex = useRef<null | number>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active === null) {
      if (dialog.open) dialog.close();
      return;
    }
    restoreIndex.current = active;
    if (!dialog.open) dialog.showModal();
    closeButtonRef.current?.focus();
  }, [active]);

  useEffect(() => {
    if (active === null) return;

    function onKey(event: KeyboardEvent) {
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

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, photos.length]);

  if (photos.length === 0) return null;

  const activePhoto = active !== null ? photos[active] : null;

  return (
    <>
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
            className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]"
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
              const photoAlt = speciesPhotoAlt(
                name,
                scientificName,
                location,
                photo.credit,
              );
              return (
                <figure
                  className={cn(
                    "group relative overflow-hidden rounded-[24px] bg-ink",
                    featured
                      ? "col-span-2 aspect-16/10 md:col-span-3"
                      : "aspect-4/5",
                  )}
                  key={photo.src}
                >
                  <button
                    aria-label={photoAlt}
                    className="absolute inset-0 w-full text-left focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
                    onClick={() => {
                      if (!opened.current) {
                        opened.current = true;
                        trackEvent("gallery_open", {
                          image_count: photos.length,
                          image_index: index,
                          species_id: speciesId,
                        });
                      }
                      setActive(index);
                    }}
                    ref={(node) => {
                      triggerRefs.current[index] = node;
                    }}
                    type="button"
                  >
                    <picture className="media-placeholder absolute inset-0 block size-full">
                      {pictureSources(photo.src, {
                        sizes: featured
                          ? "(max-width: 1480px) 100vw, 1400px"
                          : "(max-width: 768px) 50vw, (max-width: 1480px) 33vw, 460px",
                      }).map((source) => (
                        <source key={source.key} {...source.props} />
                      ))}
                      <img
                        alt={photoAlt}
                        className="absolute inset-0 size-full object-cover text-transparent"
                        decoding="async"
                        loading="lazy"
                        src={photo.src}
                      />
                    </picture>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20" />
                    {!hasPhotoCredit(photo.credit) ? (
                      <span className="absolute bottom-4 left-4 z-1 font-display text-[13px] text-white/0 group-hover:text-white/80">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    ) : null}
                  </button>
                  <PhotoCreditCaption
                    credit={photo.credit}
                    speciesId={speciesId}
                    variant="thumb"
                  />
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      <dialog
        aria-label={t("gallery")}
        className="fixed inset-0 z-100 m-0 hidden size-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-0 backdrop:bg-black/92 open:flex"
        onClose={() => {
          setActive(null);
          const index = restoreIndex.current;
          if (index !== null) triggerRefs.current[index]?.focus();
        }}
        ref={dialogRef}
      >
        {activePhoto ? (
          <>
            <button
              aria-label={t("close")}
              className="absolute inset-0 bg-transparent"
              onClick={() => dialogRef.current?.close()}
              type="button"
            />
            <button
              aria-label={t("close")}
              className="absolute top-5 right-5 z-10 rounded-full border border-white/15 p-2.5 text-white/80 hover:bg-white/10 hover:text-white"
              onClick={() => dialogRef.current?.close()}
              ref={closeButtonRef}
              type="button"
            >
              <X className="size-5" />
            </button>

            {photos.length > 1 && (
              <>
                <button
                  aria-label={t("prevPhoto")}
                  className="absolute top-1/2 left-3 z-10 -translate-y-1/2 rounded-full border border-white/15 p-2.5 text-white/80 hover:bg-white/10 hover:text-white sm:left-6"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActive((current) =>
                      current === null
                        ? null
                        : (current - 1 + photos.length) % photos.length,
                    );
                  }}
                  type="button"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  aria-label={t("nextPhoto")}
                  className="absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-full border border-white/15 p-2.5 text-white/80 hover:bg-white/10 hover:text-white sm:right-6"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActive((current) =>
                      current === null ? null : (current + 1) % photos.length,
                    );
                  }}
                  type="button"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}

            <div
              className="relative z-10 mx-auto flex h-[78svh] w-[min(92vw,1100px)] flex-col"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative min-h-0 flex-1">
                <picture>
                  {pictureSources(activePhoto.src, {
                    sizes: "(max-width: 1196px) 92vw, 1100px",
                  }).map((source) => (
                    <source key={source.key} {...source.props} />
                  ))}
                  <img
                    alt={speciesPhotoAlt(
                      name,
                      scientificName,
                      location,
                      activePhoto.credit,
                    )}
                    className="absolute inset-0 size-full object-contain text-transparent"
                    decoding="async"
                    fetchPriority="high"
                    src={activePhoto.src}
                  />
                </picture>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-1.5 pt-4 pb-1">
                <PhotoCreditCaption
                  credit={activePhoto.credit}
                  speciesId={speciesId}
                  variant="lightbox"
                />
                <p className="text-[12px] tracking-[0.2em] text-white/35">
                  {(active ?? 0) + 1} / {photos.length}
                </p>
              </div>
            </div>
          </>
        ) : null}
      </dialog>
    </>
  );
}
