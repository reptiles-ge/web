"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { BiologyExpandable } from "@/components/BiologyExpandable";
import { cn } from "@/lib/cn";

export function BiologyDisclosure({
  anchorLabel,
  body,
  className,
  defaultOpen,
  editorField,
  id,
  readLess,
  readMore,
  speciesId,
  title,
}: {
  anchorLabel: string;
  body: string;
  className?: string;
  defaultOpen: boolean;
  editorField?: string;
  id: string;
  readLess: string;
  readMore: string;
  speciesId?: string;
  title: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <article
      className={cn(
        "rounded-[22px] bg-card p-5 shadow-[0_10px_26px_rgba(14,20,17,0.05)] lg:min-h-[208px] lg:rounded-[28px] lg:px-7 lg:py-[26px]",
        className,
      )}
    >
      <div className="relative flex items-center justify-between gap-4">
        <AnchoredHeading
          anchorLabel={anchorLabel}
          as="h3"
          className="font-display text-[17px] font-semibold text-foreground lg:text-[20px]"
          id={id}
        >
          {title}
        </AnchoredHeading>
        <button
          aria-controls={panelId}
          aria-expanded={open}
          aria-label={title}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-foreground after:absolute after:-inset-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
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
      <div
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none lg:visible lg:grid-rows-[1fr]",
          open ? "grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
        )}
        data-state={open ? "open" : "closed"}
        id={panelId}
      >
        <div className="min-h-0 overflow-hidden lg:overflow-visible">
          <BiologyExpandable
            body={body}
            clampFromDesktop
            collapseEditable
            editorField={editorField}
            needsExpand
            readLess={readLess}
            readMore={readMore}
            speciesId={speciesId}
          />
        </div>
      </div>
    </article>
  );
}
