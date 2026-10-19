"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { cn } from "@/lib/cn";

type NewsArticleTocItem = {
  id: string;
  label: string;
};

const ACTIVE_LINE_VIEWPORT_RATIO = 0.4;

export function NewsArticleToc({
  heading,
  items,
  summary,
}: {
  heading: string;
  items: NewsArticleTocItem[];
  summary: string;
}) {
  const listId = useId();
  const [activeId, setActiveId] = useState<null | string>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame = 0;

    function measure() {
      frame = 0;
      const line = window.innerHeight * ACTIVE_LINE_VIEWPORT_RATIO;
      let current: null | string = null;
      for (const item of items) {
        const target = document.getElementById(item.id);
        if (target && target.getBoundingClientRect().top <= line) {
          current = item.id;
        }
      }
      setActiveId(current);
    }

    function schedule() {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav
      aria-label={heading}
      className="mt-2 rounded-[20px] bg-(--nw-card) px-[18px] xl:mt-0 xl:rounded-none xl:bg-transparent xl:px-0"
    >
      <button
        aria-controls={listId}
        aria-expanded={open}
        className="flex h-[52px] w-full cursor-pointer items-center justify-between text-left text-[14.5px] font-semibold xl:hidden"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {summary}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 text-(--nw-muted) transition-transform",
            open && "rotate-180",
          )}
          strokeWidth={1.75}
        />
      </button>
      <p className="hidden text-[11px] font-semibold tracking-[0.16em] text-(--nw-muted) uppercase xl:block">
        {heading}
      </p>
      <ol
        className={cn(
          "pb-2 xl:mt-3.5 xl:block xl:border-l-2 xl:border-(--nw-line) xl:pb-0",
          !open && "hidden",
        )}
        id={listId}
      >
        {items.map((item, index) => {
          const active = item.id === activeId;
          return (
            <li className="xl:-ml-0.5" key={item.id}>
              <a
                aria-current={active ? "location" : undefined}
                className={cn(
                  "flex gap-3 border-t border-(--nw-line-soft) py-2.5 text-[14px] leading-[1.4] text-(--nw-muted) xl:border-t-0 xl:border-l-2 xl:py-[9px] xl:pl-3.5 xl:transition-colors",
                  active
                    ? "xl:border-(--nw-accent) xl:font-semibold xl:text-(--nw-ink)"
                    : "xl:border-transparent xl:hover:text-(--nw-ink)",
                )}
                href={`#${item.id}`}
              >
                <span
                  className={cn(
                    "w-[22px] shrink-0 text-[12px] font-bold text-(--nw-muted) tabular-nums",
                    active && "xl:text-(--nw-accent)",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
