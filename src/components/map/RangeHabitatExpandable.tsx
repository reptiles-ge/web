"use client";

import { ChevronDown } from "lucide-react";
import { useId } from "react";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { cn } from "@/lib/cn";
import { useExpandableText } from "@/lib/useExpandableText";

const PREVIEW_LINES = 3;

export function RangeHabitatExpandable({
  body,
  readLess,
  readMore,
}: {
  body: string;
  readLess: string;
  readMore: string;
}) {
  const { buttonRef, open, textRef, toggle } = useExpandableText(PREVIEW_LINES);
  const textId = useId();

  return (
    <>
      <p
        className={cn(
          "scroll-mt-40 text-[17px] leading-[1.65] whitespace-pre-line text-muted-foreground lg:text-[16px]",
          !open && "line-clamp-3",
        )}
        id={textId}
        ref={textRef}
      >
        <PhoneLinkedText>{body}</PhoneLinkedText>
      </p>
      <button
        aria-controls={textId}
        aria-expanded={open}
        className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-foreground underline decoration-foreground/30 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={toggle}
        ref={buttonRef}
        type="button"
      >
        {open ? readLess : readMore}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4", open && "rotate-180")}
        />
      </button>
    </>
  );
}
