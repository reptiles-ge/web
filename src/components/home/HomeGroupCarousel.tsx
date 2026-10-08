"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type StripEdge = "both" | "end" | "middle" | "start";

const arrowClass =
  "flex size-11 items-center justify-center rounded-full border transition-[background-color,color,opacity] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default disabled:opacity-35";

export function HomeGroupCarousel({
  action,
  children,
  nextLabel,
  previousLabel,
}: {
  action: ReactNode;
  children: ReactNode;
  nextLabel: string;
  previousLabel: string;
}) {
  const strip = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const pointer = useRef({
    active: false,
    moved: false,
    scrollLeft: 0,
    startX: 0,
  });
  const [edge, setEdge] = useState<StripEdge>("start");

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const observer = new ResizeObserver(() =>
      setEdge(syncStrip(el, thumb.current)),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function move(direction: -1 | 1) {
    const el = strip.current;
    if (!el) return;
    el.scrollBy({
      behavior: "smooth",
      left: direction * Math.max(el.clientWidth * 0.6, 312),
    });
  }

  function stopDrag(event: PointerEvent<HTMLDivElement>) {
    const el = strip.current;
    pointer.current.active = false;
    if (!el) return;
    if (el.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
    el.style.scrollSnapType = "";
    el.style.scrollBehavior = "";
    el.classList.remove("cursor-grabbing", "select-none");
  }

  return (
    <>
      <div className="mx-auto hidden max-w-[1440px] items-center justify-between gap-6 px-[60px] pt-7 lg:flex">
        {action}
        <div className="flex gap-2.5">
          <button
            aria-label={previousLabel}
            className={`${arrowClass} border-border bg-card text-foreground enabled:hover:bg-surface`}
            disabled={edge === "start" || edge === "both"}
            onClick={() => move(-1)}
            type="button"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
          </button>
          <button
            aria-label={nextLabel}
            className={`${arrowClass} border-foreground bg-foreground text-background enabled:hover:border-primary enabled:hover:bg-primary enabled:hover:text-white dark:enabled:hover:text-ink`}
            disabled={edge === "end" || edge === "both"}
            onClick={() => move(1)}
            type="button"
          >
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
      <div
        className="no-scrollbar mt-6 flex cursor-grab snap-x snap-mandatory scroll-pl-(--strip-gutter) gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pr-6 pb-2 pl-(--strip-gutter) [--strip-gutter:24px] lg:mt-[22px] lg:gap-4 lg:pr-[60px] lg:[--strip-gutter:max(60px,calc((100%-1320px)/2))]"
        onClickCapture={(event) => {
          if (!pointer.current.moved) return;
          event.preventDefault();
          event.stopPropagation();
          pointer.current.moved = false;
        }}
        onDragStart={(event) => event.preventDefault()}
        onPointerCancel={stopDrag}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse" || event.button !== 0) return;
          pointer.current = {
            active: true,
            moved: false,
            scrollLeft: event.currentTarget.scrollLeft,
            startX: event.clientX,
          };
        }}
        onPointerMove={(event) => {
          const drag = pointer.current;
          if (!drag.active) return;
          const distance = event.clientX - drag.startX;
          if (!drag.moved && Math.abs(distance) < 6) return;
          if (!drag.moved) {
            drag.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.style.scrollSnapType = "none";
            event.currentTarget.style.scrollBehavior = "auto";
            event.currentTarget.classList.add("cursor-grabbing", "select-none");
          }
          event.preventDefault();
          event.currentTarget.scrollLeft = drag.scrollLeft - distance;
        }}
        onPointerUp={stopDrag}
        onScroll={(event) =>
          setEdge(syncStrip(event.currentTarget, thumb.current))
        }
        ref={strip}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className="mx-auto mt-4 max-w-[1440px] px-6 lg:mt-5 lg:px-[60px]"
      >
        <div className="h-[3px] overflow-hidden rounded-full bg-border lg:max-w-[320px]">
          <span
            className="block h-full w-1/3 rounded-full bg-foreground/70"
            ref={thumb}
          />
        </div>
      </div>
    </>
  );
}

function syncStrip(el: HTMLDivElement, thumb: HTMLSpanElement | null) {
  const max = el.scrollWidth - el.clientWidth;
  const size = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1;
  const progress = max > 0 ? Math.min(Math.max(el.scrollLeft / max, 0), 1) : 0;
  if (thumb) {
    thumb.style.width = `${size * 100}%`;
    thumb.style.transform = `translateX(${(progress * (1 - size) * 100) / size}%)`;
  }
  if (max <= 1) return "both";
  if (el.scrollLeft <= 1) return "start";
  return el.scrollLeft >= max - 1 ? "end" : "middle";
}
