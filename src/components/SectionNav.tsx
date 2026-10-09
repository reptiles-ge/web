"use client";

import { useEffect, useRef, useState } from "react";

import type { DangerLevel } from "@/data/speciesTypes";

import { cn } from "@/lib/cn";

type SectionNavItem = {
  count?: number;
  id: string;
  label: string;
};

type SectionNavProps = {
  ariaLabel: string;
  floating?: boolean;
  items: SectionNavItem[];
  name?: string;
  riskLevel?: DangerLevel;
};

const ACTIVE_LINE_OFFSET = 64;
const ACTIVE_LINE_VIEWPORT_RATIO = 0.35;
const FLOATING_EXIT_MARGIN = 120;

export function SectionNav({
  ariaLabel,
  floating = false,
  items,
  name,
  riskLevel,
}: SectionNavProps) {
  const [activeId, setActiveId] = useState<null | string>(null);
  const [pinned, setPinned] = useState(false);
  const [shown, setShown] = useState(!floating);
  const [fade, setFade] = useState({ end: false, start: false });
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let frame = 0;

    function measure() {
      frame = 0;
      const nav = navRef.current;
      if (!nav) return;

      const navRect = nav.getBoundingClientRect();
      const stickyTop = Number.parseFloat(window.getComputedStyle(nav).top);
      setPinned(navRect.top <= (Number.isNaN(stickyTop) ? 0 : stickyTop) + 1);

      const line = Math.max(
        navRect.bottom + ACTIVE_LINE_OFFSET,
        window.innerHeight * ACTIVE_LINE_VIEWPORT_RATIO,
      );
      let current: null | string = null;
      for (const item of items) {
        const target = document.getElementById(item.id);
        if (target && target.getBoundingClientRect().top <= line) {
          current = item.id;
        }
      }
      setActiveId(current);

      const list = listRef.current;
      if (list) {
        const end = list.scrollWidth - list.clientWidth - list.scrollLeft > 4;
        const start = list.scrollLeft > 4;
        setFade((previous) =>
          previous.end === end && previous.start === start
            ? previous
            : { end, start },
        );
      }

      const root = nav.parentElement;
      if (!root) return;

      const rootRect = root.getBoundingClientRect();
      const distance = rootRect.height - window.innerHeight;
      const ratio =
        distance > 0 ? Math.min(1, Math.max(0, -rootRect.top / distance)) : 0;
      nav.style.setProperty("--section-progress", ratio.toFixed(4));
      if (floating) {
        setShown(
          current !== null &&
            rootRect.bottom > navRect.bottom + FLOATING_EXIT_MARGIN,
        );
      }
    }

    function schedule() {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    }

    const scroller = listRef.current;
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    scroller?.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      scroller?.removeEventListener("scroll", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [floating, items]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !activeId || list.scrollWidth <= list.clientWidth) return;

    const link = list.querySelector<HTMLElement>(
      `[data-section="${activeId}"]`,
    );
    if (!link) return;

    const listRect = list.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const left =
      list.scrollLeft +
      linkRect.left -
      listRect.left -
      (listRect.width - linkRect.width) / 2;
    list.scrollTo({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      left,
    });
  }, [activeId]);

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "top-[75px] z-30 border-y border-border bg-surface/95 backdrop-blur-xl",
        floating
          ? "fixed inset-x-0 transition-[opacity,translate] duration-300 ease-out"
          : "sticky",
        shown ? "opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
      )}
      inert={!shown}
      ref={navRef}
    >
      <div className="mx-auto flex h-14 max-w-[1440px] items-center lg:px-[60px]">
        {name ? (
          <div
            aria-hidden="true"
            className={cn(
              "hidden shrink-0 items-center overflow-hidden transition-[max-width,opacity,margin] duration-300 ease-out lg:flex",
              pinned ? "mr-7 max-w-72 opacity-100" : "mr-0 max-w-0 opacity-0",
            )}
          >
            {riskLevel ? (
              <span
                className={cn(
                  "mr-2.5 size-1.5 shrink-0 rounded-full",
                  riskDotClass(riskLevel),
                )}
              />
            ) : null}
            <span className="truncate font-display text-[14px] leading-none font-semibold whitespace-nowrap text-foreground">
              {name}
            </span>
            <span className="ml-4 h-4 w-px shrink-0 bg-border" />
          </div>
        ) : null}
        <div className="relative h-full min-w-0 flex-1 lg:-ml-3">
          <ul
            className="flex h-full scrollbar-none items-center gap-1.5 overflow-x-auto px-4 text-[13.5px] leading-none lg:px-0 [&::-webkit-scrollbar]:hidden"
            ref={listRef}
          >
            {items.map((item) => {
              const active = item.id === activeId;

              return (
                <li className="shrink-0" key={item.id}>
                  <a
                    aria-current={active ? "location" : undefined}
                    className={cn(
                      "flex h-10 items-center rounded-full px-[15px] font-medium whitespace-nowrap transition-colors duration-200",
                      active
                        ? "bg-foreground text-background"
                        : "bg-card text-foreground hover:text-primary",
                    )}
                    data-section={item.id}
                    href={`#${item.id}`}
                  >
                    {item.label}
                    {item.count ? (
                      <span
                        className={cn(
                          "ml-2 text-[12px] font-normal tabular-nums",
                          active
                            ? "text-background/70"
                            : "text-muted-foreground",
                        )}
                      >
                        {item.count}
                      </span>
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-l from-transparent to-surface transition-opacity duration-200",
              fade.start ? "opacity-100" : "opacity-0",
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-r from-transparent to-surface transition-opacity duration-200",
              fade.end ? "opacity-100" : "opacity-0",
            )}
          />
        </div>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-(--section-progress,0) bg-primary"
      />
    </nav>
  );
}

function riskDotClass(level: DangerLevel) {
  if (level === "High") return "bg-destructive";
  if (level === "Moderate") return "bg-gold";
  return "bg-primary";
}
