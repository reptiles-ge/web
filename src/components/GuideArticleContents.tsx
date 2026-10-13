"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import type { contentEditorAttributes } from "@/lib/contentEditorAttributes";

import { cn } from "@/lib/cn";

type GuideArticleContentsItem = {
  anchor: string;
  editorAttributes: ReturnType<typeof contentEditorAttributes>;
  label: string;
};

export function GuideArticleContents({
  headingId,
  items,
  label,
}: {
  headingId: string;
  items: readonly GuideArticleContentsItem[];
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  return (
    <nav
      aria-labelledby={headingId}
      className="mt-8 border-y border-border py-4 sm:mt-12 lg:py-7"
    >
      <div className="relative flex min-h-11 items-center justify-between gap-4 lg:min-h-0">
        <h2
          className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase"
          id={headingId}
        >
          {label}{" "}
          <span className="ml-2 rounded-full bg-card px-2 py-0.5 tracking-normal text-foreground/70 tabular-nums lg:hidden">
            {items.length}
          </span>
        </h2>
        <button
          aria-controls={listId}
          aria-expanded={open}
          aria-labelledby={headingId}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-card text-foreground after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 transition-transform duration-300 motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        </button>
      </div>
      <ol
        className={cn(
          "mt-3 grid gap-x-10 gap-y-2.5 pb-2 text-[15px] leading-snug sm:grid-cols-2 lg:mt-4 lg:pb-0",
          !open && "max-lg:hidden",
        )}
        id={listId}
      >
        {items.map((item) => (
          <li key={item.anchor}>
            <a
              className="text-foreground/80 underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary/40"
              {...item.editorAttributes}
              href={`#${item.anchor}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
