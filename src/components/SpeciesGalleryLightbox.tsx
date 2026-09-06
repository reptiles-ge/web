"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type { PhotoCredit } from "@/data/speciesTypes";

import { PhotoCreditCaption } from "@/components/PhotoCreditCaption";
import { trackEvent } from "@/lib/analytics";
import { GALLERY_LIGHTBOX_SIZES } from "@/lib/imageSizes";

export type GallerySlide = {
  alt: string;
  credit?: PhotoCredit;
  height?: number;
  photoConfidence?: PhotoCredit["photoConfidence"];
  sources: GallerySource[];
  src: string;
  width?: number;
};

type GalleryContextValue = {
  openAt: (index: number) => void;
  registerTrigger: (index: number, node: HTMLButtonElement | null) => void;
};

type GallerySource = {
  key: string;
  props: {
    media?: string;
    sizes: string;
    srcSet: string;
    type: string;
  };
};

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function GalleryOpenButton({
  alt,
  children,
  index,
}: {
  alt: string;
  children: ReactNode;
  index: number;
}) {
  const gallery = useContext(GalleryContext);
  if (!gallery) return null;

  return (
    <button
      aria-label={alt}
      className="absolute inset-0 w-full text-left focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
      onClick={() => gallery.openAt(index)}
      ref={(node) => gallery.registerTrigger(index, node)}
      type="button"
    >
      {children}
    </button>
  );
}

export function SpeciesGalleryLightbox({
  children,
  closeLabel,
  galleryLabel,
  nextLabel,
  prevLabel,
  slides,
  speciesId,
}: {
  children: ReactNode;
  closeLabel: string;
  galleryLabel: string;
  nextLabel: string;
  prevLabel: string;
  slides: GallerySlide[];
  speciesId: string;
}) {
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
            : (current - 1 + slides.length) % slides.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActive((current) =>
          current === null ? null : (current + 1) % slides.length,
        );
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, slides.length]);

  const activeSlide = active !== null ? slides[active] : null;

  return (
    <GalleryContext.Provider
      value={{
        openAt: (index) => {
          if (!opened.current) {
            opened.current = true;
            trackEvent("gallery_open", {
              image_count: slides.length,
              image_index: index,
              species_id: speciesId,
            });
          }
          setActive(index);
        },
        registerTrigger: (index, node) => {
          triggerRefs.current[index] = node;
        },
      }}
    >
      {children}
      <dialog
        aria-label={galleryLabel}
        className="fixed inset-0 z-100 m-0 hidden size-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-0 backdrop:bg-black/92 open:flex"
        onClose={() => {
          setActive(null);
          const index = restoreIndex.current;
          if (index !== null) triggerRefs.current[index]?.focus();
        }}
        ref={dialogRef}
      >
        {activeSlide ? (
          <>
            <button
              aria-label={closeLabel}
              className="absolute inset-0 bg-transparent"
              onClick={() => dialogRef.current?.close()}
              type="button"
            />
            <button
              aria-label={closeLabel}
              className="absolute top-5 right-5 z-10 rounded-full border border-white/15 p-2.5 text-white/80 hover:bg-white/10 hover:text-white"
              onClick={() => dialogRef.current?.close()}
              ref={closeButtonRef}
              type="button"
            >
              <X className="size-5" />
            </button>

            {slides.length > 1 ? (
              <>
                <button
                  aria-label={prevLabel}
                  className="absolute top-1/2 left-3 z-10 -translate-y-1/2 rounded-full border border-white/15 p-2.5 text-white/80 hover:bg-white/10 hover:text-white sm:left-6"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActive((current) =>
                      current === null
                        ? null
                        : (current - 1 + slides.length) % slides.length,
                    );
                  }}
                  type="button"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  aria-label={nextLabel}
                  className="absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-full border border-white/15 p-2.5 text-white/80 hover:bg-white/10 hover:text-white sm:right-6"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActive((current) =>
                      current === null
                        ? null
                        : (current + 1) % slides.length,
                    );
                  }}
                  type="button"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            ) : null}

            <div
              className="relative z-10 mx-auto flex h-[78svh] w-[min(92vw,1100px)] flex-col"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative min-h-0 flex-1">
                <picture>
                  {activeSlide.sources.map((source) => (
                    <source key={source.key} {...source.props} />
                  ))}
                  <img
                    alt={activeSlide.alt}
                    className="absolute inset-0 size-full object-contain text-transparent"
                    decoding="async"
                    fetchPriority="high"
                    height={activeSlide.height}
                    sizes={GALLERY_LIGHTBOX_SIZES}
                    src={activeSlide.src}
                    width={activeSlide.width}
                  />
                </picture>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-1.5 pt-4 pb-1">
                <PhotoCreditCaption
                  credit={activeSlide.credit}
                  photoConfidence={activeSlide.photoConfidence}
                  speciesId={speciesId}
                  variant="lightbox"
                />
                <p className="text-[12px] tracking-[0.2em] text-white/50">
                  {(active ?? 0) + 1} / {slides.length}
                </p>
              </div>
            </div>
          </>
        ) : null}
      </dialog>
    </GalleryContext.Provider>
  );
}
