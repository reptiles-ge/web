"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

type NewsArticleTocItem = {
  id: string;
  label: string;
};

const ACTIVE_LINE_VIEWPORT_RATIO = 0.4;

export function NewsArticleToc({
  heading,
  items,
}: {
  heading: string;
  items: NewsArticleTocItem[];
}) {
  const [activeId, setActiveId] = useState<null | string>(null);

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
    <nav aria-label={heading}>
      <p className="text-[11px] font-semibold tracking-[0.16em] text-(--nw-muted) uppercase">
        {heading}
      </p>
      <ol className="mt-3.5 border-l-2 border-(--nw-line)">
        {items.map((item, index) => {
          const active = item.id === activeId;
          return (
            <li className="-ml-0.5" key={item.id}>
              <a
                aria-current={active ? "location" : undefined}
                className={cn(
                  "flex gap-3 border-l-2 py-[9px] pl-3.5 text-[14px] leading-[1.4] transition-colors",
                  active
                    ? "border-(--nw-accent) font-semibold text-(--nw-ink)"
                    : "border-transparent text-(--nw-muted) hover:text-(--nw-ink)",
                )}
                href={`#${item.id}`}
              >
                <span
                  className={cn(
                    "w-[22px] shrink-0 text-[12px] font-bold tabular-nums",
                    active ? "text-(--nw-accent)" : "text-(--nw-sep)",
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
