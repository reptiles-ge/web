"use client";

import { type PointerEvent, useRef, useState } from "react";

import {
  optimizedEntry,
  optimizedImgSrc,
  pictureSources,
} from "@/data/optimizedImages";

export const MOBILE_HERO_PHOTO_CHANGE_EVENT =
  "species-mobile-hero-photo-change";

export type MobileHeroSlide = {
  alt: string;
  displaySrc: string;
  gallerySrc: string;
};

export function SpeciesMobileHeroCarousel({
  label,
  slides,
  speciesId,
}: {
  label: string;
  slides: MobileHeroSlide[];
  speciesId: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const dragRef = useRef({
    active: false,
    moved: false,
    scrollLeft: 0,
    startX: 0,
    startY: 0,
  });
  const [active, setActive] = useState(0);

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    const scroller = event.currentTarget;
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    if (scroller.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
    scroller.style.scrollSnapType = "";
    if (!drag.moved) return;

    const distance = event.clientX - drag.startX;
    const startIndex = Math.round(drag.scrollLeft / scroller.clientWidth);
    const next = Math.max(
      0,
      Math.min(
        slides.length - 1,
        Math.abs(distance) > 40
          ? startIndex + (distance < 0 ? 1 : -1)
          : startIndex,
      ),
    );
    scroller.scrollTo({
      behavior: "smooth",
      left: next * scroller.clientWidth,
    });
  }

  function onScroll() {
    const scroller = scrollerRef.current;
    if (!scroller || !scroller.clientWidth) return;
    const next = Math.max(
      0,
      Math.min(
        slides.length - 1,
        Math.round(scroller.scrollLeft / scroller.clientWidth),
      ),
    );
    if (next === activeRef.current) return;
    activeRef.current = next;
    setActive(next);
    window.dispatchEvent(
      new CustomEvent(MOBILE_HERO_PHOTO_CHANGE_EVENT, {
        detail: { index: next, speciesId },
      }),
    );
  }

  return (
    <>
      <div
        aria-label={label}
        className="absolute inset-0 flex cursor-grab touch-pan-y snap-x snap-mandatory scrollbar-none overflow-x-auto overscroll-x-contain lg:hidden [&::-webkit-scrollbar]:hidden"
        onDragStart={(event) => event.preventDefault()}
        onPointerCancel={finishDrag}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          dragRef.current = {
            active: true,
            moved: false,
            scrollLeft: event.currentTarget.scrollLeft,
            startX: event.clientX,
            startY: event.clientY,
          };
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (!drag.active) return;
          const distanceX = event.clientX - drag.startX;
          const distanceY = event.clientY - drag.startY;
          if (
            !drag.moved &&
            (Math.abs(distanceX) < 6 ||
              Math.abs(distanceX) <= Math.abs(distanceY))
          )
            return;
          if (!drag.moved) {
            drag.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.style.scrollSnapType = "none";
          }
          event.preventDefault();
          event.currentTarget.scrollLeft = drag.scrollLeft - distanceX;
        }}
        onPointerUp={finishDrag}
        onScroll={onScroll}
        ref={scrollerRef}
        role="region"
        tabIndex={0}
      >
        {slides.map((slide, index) => {
          const entry = optimizedEntry(slide.displaySrc);
          return (
            <picture
              className="block size-full shrink-0 snap-start bg-ink"
              key={slide.gallerySrc}
            >
              {pictureSources(slide.displaySrc, { sizes: "100vw" }).map(
                (source) => (
                  <source key={source.key} {...source.props} />
                ),
              )}
              <img
                alt={slide.alt}
                className="size-full object-cover"
                decoding="async"
                draggable={false}
                fetchPriority={index === 0 ? "high" : "low"}
                height={entry?.height}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="100vw"
                src={optimizedImgSrc(slide.displaySrc, 800)}
                width={entry?.width}
              />
            </picture>
          );
        })}
      </div>
      <a
        aria-label={`${label}: ${active + 1}/${slides.length}`}
        className="absolute top-[88px] right-6 z-20 inline-flex h-11 min-w-14 items-center justify-center rounded-full bg-ink/50 px-3 text-[13.5px] font-medium text-white tabular-nums backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 lg:hidden"
        data-species-gallery-src={slides[active].gallerySrc}
        href="#gallery"
      >
        {active + 1}/{slides.length}
      </a>
    </>
  );
}
