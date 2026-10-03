"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  createContext,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { PhotoCredit } from "@/data/speciesTypes";
import type { SpeciesHref } from "@/lib/speciesRoutes";

import { PhotoCreditCaption } from "@/components/PhotoCreditCaption";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { GALLERY_LIGHTBOX_SIZES } from "@/lib/imageSizes";

export type GallerySlide = {
  alt: string;
  credit?: PhotoCredit;
  height?: number;
  photoConfidence?: PhotoCredit["photoConfidence"];
  sources: GallerySource[];
  src: string;
  subject?: {
    href: SpeciesHref;
    name: string;
  };
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
const SWIPE_SLOP = 8;
const SWIPE_THRESHOLD = 56;
const GALLERY_TRIGGER_SELECTOR = "[data-species-gallery-src]";

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
  renderAllSlides = false,
  slides,
  speciesId,
}: {
  children: ReactNode;
  closeLabel: string;
  galleryLabel: string;
  nextLabel: string;
  prevLabel: string;
  renderAllSlides?: boolean;
  slides: GallerySlide[];
  speciesId?: string;
}) {
  const [active, setActive] = useState<null | number>(null);
  const opened = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const externalTriggerRef = useRef<HTMLElement | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const restoreIndex = useRef<null | number>(null);
  const locked = active !== null;

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active === null) {
      if (dialog.open) dialog.close();
      return;
    }
    restoreIndex.current = active;
    if (!dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    }
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

  useEffect(() => {
    if (!locked) return;

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [locked]);

  const openAt = useCallback(
    (index: number) => {
      if (!opened.current) {
        opened.current = true;
        trackEvent("gallery_open", {
          image_count: slides.length,
          image_index: index,
          ...(speciesId ? { species_id: speciesId } : {}),
        });
      }
      setActive(index);
    },
    [slides.length, speciesId],
  );

  const openExternalTrigger = useEffectEvent(
    (src: string, trigger: HTMLElement) => {
      const index = slides.findIndex((slide) => slide.src === src);
      if (index === -1) return false;

      externalTriggerRef.current = trigger;
      openAt(index);
      return true;
    },
  );

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trigger = target.closest<HTMLAnchorElement>(
        GALLERY_TRIGGER_SELECTOR,
      );
      if (!trigger) return;

      const src = trigger.dataset.speciesGallerySrc;
      if (!src) return;

      const opened = openExternalTrigger(src, trigger);
      if (!opened) return;

      event.preventDefault();
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const registerTrigger = useCallback(
    (index: number, node: HTMLButtonElement | null) => {
      triggerRefs.current[index] = node;
    },
    [],
  );

  const galleryValue = useMemo(
    () => ({ openAt, registerTrigger }),
    [openAt, registerTrigger],
  );

  return (
    <GalleryContext.Provider value={galleryValue}>
      {children}
      <dialog
        aria-label={galleryLabel}
        className="fixed inset-0 z-100 m-0 hidden size-full max-h-none max-w-none border-0 bg-transparent p-0 backdrop:bg-black open:block"
        onClose={() => {
          setActive(null);
          const externalTrigger = externalTriggerRef.current;
          externalTriggerRef.current = null;
          if (externalTrigger?.isConnected) {
            externalTrigger.focus({ preventScroll: true });
            return;
          }

          const index = restoreIndex.current;
          if (index !== null) {
            triggerRefs.current[index]?.focus({ preventScroll: true });
          }
        }}
        ref={dialogRef}
      >
        {renderAllSlides || active !== null ? (
          <GalleryPhotoViewer
            active={active}
            closeButtonRef={closeButtonRef}
            closeLabel={closeLabel}
            nextLabel={nextLabel}
            onClose={() => dialogRef.current?.close()}
            onSelect={setActive}
            onStep={(delta) =>
              setActive((current) =>
                current === null
                  ? null
                  : (current + delta + slides.length) % slides.length,
              )
            }
            prevLabel={prevLabel}
            slides={slides}
            speciesId={speciesId}
          />
        ) : null}
      </dialog>
    </GalleryContext.Provider>
  );
}

function GalleryPhotoStage({
  active,
  activeSlide,
  closeButtonRef,
  closeLabel,
  countRef,
  dragRef,
  endMouseDrag,
  many,
  nextLabel,
  onClose,
  onSelect,
  onStep,
  pointerDownRef,
  prevLabel,
  scrollerRef,
  scrollTargetRef,
  slides,
  speciesId,
  stripRef,
  suppressClickRef,
}: {
  active: null | number;
  activeSlide: GallerySlide | null;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  closeLabel: string;
  countRef: RefObject<HTMLParagraphElement | null>;
  dragRef: RefObject<null | {
    moved: boolean;
    startLeft: number;
    startX: number;
  }>;
  endMouseDrag: (clientX: number) => void;
  many: boolean;
  nextLabel: string;
  onClose: () => void;
  onSelect: (index: number) => void;
  onStep: (delta: number) => void;
  pointerDownRef: RefObject<boolean>;
  prevLabel: string;
  scrollerRef: RefObject<HTMLDivElement | null>;
  scrollTargetRef: RefObject<null | number>;
  slides: GallerySlide[];
  speciesId?: string;
  stripRef: RefObject<HTMLDivElement | null>;
  suppressClickRef: RefObject<boolean>;
}) {
  return (
    <div className="relative flex size-full flex-col transition-[opacity,scale] duration-300 ease-out starting:scale-[0.985] starting:opacity-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden bg-[#060807]"
      >
        {activeSlide ? (
          <picture className="block size-full" key={activeSlide.src}>
            <img
              alt=""
              className="size-full scale-125 object-cover opacity-45 blur-3xl saturate-150"
              src={slideThumbSrc(activeSlide)}
            />
          </picture>
        ) : null}
        <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/15 to-black/75" />
      </div>

      <div className="pointer-events-none relative z-20 flex shrink-0 items-center justify-between px-4 pt-4 sm:px-8 sm:pt-6">
        <p
          className="rounded-full border border-white/15 bg-black/60 px-3.5 py-1.5 text-[12px] font-medium tracking-[0.14em] text-white/85 tabular-nums"
          ref={countRef}
        >
          {(active ?? 0) + 1} / {slides.length}
        </p>
        <button
          aria-label={closeLabel}
          className="pointer-events-auto flex size-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>

      <div
        className="no-scrollbar relative z-10 flex min-h-0 w-full min-w-0 flex-1 touch-pan-x snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain select-none"
        onPointerCancel={(event) => {
          pointerDownRef.current = false;
          endMouseDrag(event.clientX);
        }}
        onPointerDown={(event) => {
          pointerDownRef.current = true;
          suppressClickRef.current = false;
          if (scrollTargetRef.current !== null) {
            scrollTargetRef.current = null;
            event.currentTarget.style.scrollSnapType = "";
            event.currentTarget.scrollTo({
              behavior: "instant",
              left: event.currentTarget.scrollLeft,
            });
          }
          if (!many || event.pointerType !== "mouse" || event.button !== 0) {
            return;
          }
          event.currentTarget.setPointerCapture(event.pointerId);
          dragRef.current = {
            moved: false,
            startLeft: event.currentTarget.scrollLeft,
            startX: event.clientX,
          };
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (!drag) return;

          const delta = event.clientX - drag.startX;
          if (Math.abs(delta) > SWIPE_SLOP) drag.moved = true;
          if (!drag.moved) return;

          event.currentTarget.style.scrollSnapType = "none";
          event.currentTarget.scrollLeft = drag.startLeft - delta;
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          pointerDownRef.current = false;
          endMouseDrag(event.clientX);
        }}
        ref={scrollerRef}
        style={{ overflowAnchor: "none" }}
      >
        {slides.map((slide, index) => (
          <GallerySlidePicture
            active={active === index}
            closeLabel={closeLabel}
            key={slide.src}
            onClose={onClose}
            slide={slide}
            suppressClickRef={suppressClickRef}
          />
        ))}
      </div>

      {many ? (
        <>
          <button
            aria-label={prevLabel}
            className="absolute top-1/2 left-6 z-20 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 sm:flex"
            onClick={() => onStep(-1)}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            aria-label={nextLabel}
            className="absolute top-1/2 right-6 z-20 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 sm:flex"
            onClick={() => onStep(1)}
            type="button"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </>
      ) : null}

      <div className="relative z-20 shrink-0 px-4 pb-4 sm:px-8 sm:pb-6">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-3.5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div className="min-w-0 sm:pb-1">
            {activeSlide?.subject ? (
              <p className="text-center text-[14px] leading-snug font-medium text-white/90 sm:text-left">
                <Link
                  className="underline decoration-white/25 underline-offset-2 transition-colors hover:decoration-white/70"
                  href={activeSlide.subject.href}
                >
                  {activeSlide.subject.name}
                </Link>
              </p>
            ) : null}
            {activeSlide ? (
              <PhotoCreditCaption
                className="text-white/70 sm:text-left"
                credit={
                  activeSlide.subject
                    ? {
                        date: activeSlide.credit?.date,
                        lat: activeSlide.credit?.lat,
                        lng: activeSlide.credit?.lng,
                        location: activeSlide.credit?.location,
                      }
                    : activeSlide.credit
                }
                photoConfidence={activeSlide.photoConfidence}
                speciesId={speciesId}
                variant="lightbox"
              />
            ) : null}
          </div>
          {many ? (
            <div
              className="no-scrollbar flex max-w-full shrink-0 gap-2 overflow-x-auto p-1 sm:max-w-[58%]"
              ref={stripRef}
            >
              {slides.map((slide, index) => (
                <button
                  aria-current={active === index}
                  aria-label={slide.alt}
                  className={cn(
                    "relative size-12 shrink-0 overflow-hidden rounded-lg transition-[opacity,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 sm:size-14",
                    active === index
                      ? "opacity-100 ring-2 ring-white"
                      : "opacity-50 hover:opacity-90",
                  )}
                  data-thumb={index}
                  key={slide.src}
                  onClick={() => onSelect(index)}
                  type="button"
                >
                  <picture className="block size-full">
                    <img
                      alt=""
                      className="size-full object-cover"
                      decoding="async"
                      loading="lazy"
                      src={slideThumbSrc(slide)}
                    />
                  </picture>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function GalleryPhotoViewer({
  active,
  closeButtonRef,
  closeLabel,
  nextLabel,
  onClose,
  onSelect,
  onStep,
  prevLabel,
  slides,
  speciesId,
}: {
  active: null | number;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  closeLabel: string;
  nextLabel: string;
  onClose: () => void;
  onSelect: (index: number) => void;
  onStep: (delta: number) => void;
  prevLabel: string;
  slides: GallerySlide[];
  speciesId?: string;
}) {
  const activeSlide = active === null ? null : slides[active];
  const many = slides.length > 1;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLParagraphElement>(null);
  const settleTimer = useRef<number | undefined>(undefined);
  const wasOpen = useRef(false);
  const scrollTargetRef = useRef<null | number>(null);
  const dragRef = useRef<null | {
    moved: boolean;
    startLeft: number;
    startX: number;
  }>(null);
  const suppressClickRef = useRef(false);
  const pointerDownRef = useRef(false);
  const swipedTo = useRef<null | number>(null);

  const publishSwipe = useEffectEvent(() => {
    const scroller = scrollerRef.current;
    if (
      !scroller ||
      active === null ||
      scrollTargetRef.current !== null ||
      scroller.clientWidth === 0
    ) {
      return;
    }
    const index = slideIndex(
      scroller.scrollLeft,
      scroller.clientWidth,
      slides.length,
    );
    if (index === active) return;
    swipedTo.current = index;
    onSelect(index);
  });

  const syncFromScroller = useEffectEvent(() => {
    const scroller = scrollerRef.current;
    if (
      !scroller ||
      active === null ||
      dragRef.current ||
      pointerDownRef.current ||
      scrollTargetRef.current !== null ||
      scroller.clientWidth === 0
    ) {
      return;
    }
    const width = scroller.clientWidth;
    const offset = scroller.scrollLeft / width;
    const index = slideIndex(scroller.scrollLeft, width, slides.length);
    if (Math.abs(offset - index) > 0.04) return;
    if (index !== active) {
      swipedTo.current = index;
      onSelect(index);
    }
  });

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    if (active === null) {
      wasOpen.current = false;
      scrollTargetRef.current = null;
      swipedTo.current = null;
      return;
    }

    if (swipedTo.current === active) {
      wasOpen.current = true;
      placeThumb(stripRef.current, active);
      return;
    }

    scrollTargetRef.current = active;

    const align = () => {
      const width = scroller.clientWidth;
      if (width === 0) return false;
      const left = active * width;
      if (Math.abs(scroller.scrollLeft - left) > 1) {
        scroller.scrollTo({
          behavior:
            wasOpen.current && !prefersReducedMotion() ? "smooth" : "instant",
          left,
        });
      }
      if (Math.abs(scroller.scrollLeft - left) <= 1) {
        scrollTargetRef.current = null;
        scroller.style.scrollSnapType = "";
      }
      wasOpen.current = true;
      placeThumb(stripRef.current, active);
      return true;
    };

    if (align()) return;

    const frame = requestAnimationFrame(align);
    const observer = new ResizeObserver(() => {
      if (align()) observer.disconnect();
    });
    observer.observe(scroller);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [active]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const filmstrip = scroller;

    const paintCount = () => {
      const count = countRef.current;
      if (!count || filmstrip.clientWidth === 0) return;
      const index = slideIndex(
        filmstrip.scrollLeft,
        filmstrip.clientWidth,
        slides.length,
      );
      const label = `${index + 1} / ${slides.length}`;
      if (count.textContent !== label) count.textContent = label;
    };

    const onScroll = () => {
      paintCount();
      const pending = scrollTargetRef.current;
      if (pending !== null && filmstrip.clientWidth > 0) {
        const left = pending * filmstrip.clientWidth;
        if (Math.abs(filmstrip.scrollLeft - left) <= 1) {
          scrollTargetRef.current = null;
          filmstrip.style.scrollSnapType = "";
        }
      }
      if (scrollTargetRef.current === null) publishSwipe();
      if ("onscrollend" in filmstrip) return;
      window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(syncFromScroller, 160);
    };

    const onScrollEnd = () => {
      if (dragRef.current || pointerDownRef.current) return;
      syncFromScroller();
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("scrollend", onScrollEnd);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("scrollend", onScrollEnd);
      window.clearTimeout(settleTimer.current);
    };
  }, [slides.length]);

  function endMouseDrag(clientX: number) {
    const drag = dragRef.current;
    const scroller = scrollerRef.current;
    dragRef.current = null;
    if (!drag || !scroller) return;
    if (!drag.moved || active === null || scroller.clientWidth === 0) {
      scroller.style.scrollSnapType = "";
      return;
    }

    suppressClickRef.current = true;
    const width = scroller.clientWidth;
    const delta = clientX - drag.startX;
    let index = slideIndex(scroller.scrollLeft, width, slides.length);
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      const startIndex = slideIndex(drag.startLeft, width, slides.length);
      if (index === startIndex) {
        index = Math.min(
          slides.length - 1,
          Math.max(0, startIndex + (delta > 0 ? -1 : 1)),
        );
      }
    }

    const left = index * width;
    const behavior = prefersReducedMotion() ? "instant" : "smooth";
    scrollTargetRef.current = index;
    scroller.style.scrollSnapType = "none";
    scroller.scrollTo({ behavior, left });
    if (Math.abs(scroller.scrollLeft - left) <= 1) {
      scrollTargetRef.current = null;
      scroller.style.scrollSnapType = "";
      if (index !== active) onSelect(index);
    }
  }

  return (
    <GalleryPhotoStage
      active={active}
      activeSlide={activeSlide}
      closeButtonRef={closeButtonRef}
      closeLabel={closeLabel}
      countRef={countRef}
      dragRef={dragRef}
      endMouseDrag={endMouseDrag}
      many={many}
      nextLabel={nextLabel}
      onClose={onClose}
      onSelect={onSelect}
      onStep={onStep}
      pointerDownRef={pointerDownRef}
      prevLabel={prevLabel}
      scrollerRef={scrollerRef}
      scrollTargetRef={scrollTargetRef}
      slides={slides}
      speciesId={speciesId}
      stripRef={stripRef}
      suppressClickRef={suppressClickRef}
    />
  );
}

function GallerySlidePicture({
  active,
  closeLabel,
  onClose,
  slide,
  suppressClickRef,
}: {
  active: boolean;
  closeLabel: string;
  onClose: () => void;
  slide: GallerySlide;
  suppressClickRef: RefObject<boolean>;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <div className="relative flex size-full min-w-full shrink-0 basis-full snap-center items-center justify-center overflow-hidden p-3 sm:px-24 sm:py-6">
      <button
        aria-label={closeLabel}
        className="absolute inset-0 cursor-default"
        onClick={() => {
          if (suppressClickRef.current) {
            suppressClickRef.current = false;
            return;
          }
          onClose();
        }}
        tabIndex={-1}
        type="button"
      />
      {loaded ? null : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute size-9 animate-spin rounded-full border-2 border-white/15 border-t-white/75 motion-reduce:animate-none"
        />
      )}
      <picture className="pointer-events-none relative z-10 flex size-full items-center justify-center">
        {slide.sources.map((source) => (
          <source key={source.key} {...source.props} />
        ))}
        <img
          alt={slide.alt}
          className={cn(
            "pointer-events-auto size-auto max-h-full max-w-full rounded-xl object-contain text-transparent shadow-[0_24px_80px_rgba(0,0,0,0.55)] transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
          )}
          decoding="async"
          draggable={false}
          fetchPriority={active ? "high" : "auto"}
          height={slide.height}
          loading={active ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          ref={imageRef}
          sizes={GALLERY_LIGHTBOX_SIZES}
          src={slide.src}
          width={slide.width}
        />
      </picture>
    </div>
  );
}

function placeThumb(strip: HTMLElement | null, index: number) {
  const thumb = strip?.querySelector<HTMLElement>(`[data-thumb="${index}"]`);
  if (!strip || !thumb) return;
  strip.scrollTo({
    behavior: "instant",
    left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2,
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function slideIndex(scrollLeft: number, width: number, count: number) {
  if (width <= 0 || count <= 0) return 0;
  return Math.min(count - 1, Math.max(0, Math.round(scrollLeft / width)));
}

function slideThumbSrc(slide: GallerySlide) {
  const srcSet = slide.sources.at(-1)?.props.srcSet;
  const smallest = srcSet?.split(",")[0]?.trim().split(/\s+/)[0];
  return smallest || slide.src;
}
