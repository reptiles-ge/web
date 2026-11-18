"use client";

import { useEffect, useRef, useState } from "react";

import { focusClass } from "@/components/regions-index/shared";
import { cn } from "@/lib/cn";

export type RegionSectionNavItem = {
  count?: number;
  desktopOnly?: boolean;
  id: string;
  label: string;
  phoneCount?: boolean;
  phoneLabel?: string;
  venomous?: boolean;
};

const ACTIVE_LINE_RATIO = 0.4;

export function RegionSectionNav({
  items,
  label,
}: {
  items: RegionSectionNavItem[];
  label: string;
}) {
  const activeId = useActiveSection(items.map((item) => item.id).join(" "));
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({
      behavior: "instant",
      left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2,
    });
  }, [activeId]);

  return (
    <div
      className="sticky top-[75px] z-30 mt-6 border-y border-(--nw-line) bg-background/90 backdrop-blur-[14px] transition-[top] duration-300 ease-out lg:mt-12 max-lg:header-hidden:top-0"
      data-markdown-skip=""
    >
      <nav
        aria-label={label}
        className="relative mx-auto box-content flex max-w-[1320px] scrollbar-none items-center gap-0.5 overflow-x-auto px-4 py-2 lg:h-[60px] lg:gap-1 lg:px-[60px] lg:py-0 [&::-webkit-scrollbar]:hidden"
        ref={navRef}
      >
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <a
              aria-current={active ? "location" : undefined}
              className={cn(
                "h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13.5px] font-medium whitespace-nowrap motion-safe:transition-colors lg:h-10 lg:gap-2 lg:px-3.5 lg:text-[14px]",
                item.desktopOnly ? "hidden lg:inline-flex" : "inline-flex",
                active
                  ? "bg-(--nw-card) text-(--nw-ink) shadow-[inset_0_0_0_1px_var(--nw-line)]"
                  : "text-(--nw-soft)",
                focusClass,
              )}
              href={`#${item.id}`}
              key={item.id}
            >
              {item.phoneLabel ? (
                <>
                  <span className="lg:hidden">{item.phoneLabel}</span>
                  <span className="hidden lg:inline">{item.label}</span>
                </>
              ) : (
                item.label
              )}
              {item.count ? (
                <span
                  className={cn(
                    "text-[12px] font-semibold tabular-nums",
                    item.venomous ? "text-(--rg-venom)" : "text-(--nw-muted)",
                    item.phoneCount === false && "hidden lg:inline",
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

function useActiveSection(idList: string) {
  const [activeId, setActiveId] = useState(() => idList.split(" ")[0]);

  useEffect(() => {
    const ids = idList.split(" ");
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * ACTIVE_LINE_RATIO;
      const passed = ids.filter((id) => {
        const target = document.getElementById(id);
        return target ? target.getBoundingClientRect().top <= line : false;
      });
      setActiveId(passed.at(-1) ?? ids[0]);
    };
    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [idList]);

  return activeId;
}
