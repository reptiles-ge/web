"use client";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { cn } from "@/lib/cn";
import { useExpandableText } from "@/lib/useExpandableText";

type SpeciesOverviewTextProps = {
  body: string;
  editable?: boolean;
  readLess: string;
  readMore: string;
  speciesId?: string;
};

const PREVIEW_LENGTH = 520;
const PREVIEW_LINES = 6;

export function SpeciesOverviewText({
  body,
  editable,
  readLess,
  readMore,
  speciesId,
}: SpeciesOverviewTextProps) {
  const { buttonRef, open, textRef, toggle } = useExpandableText(PREVIEW_LINES);
  const needsExpand = body.length > PREVIEW_LENGTH;

  return (
    <>
      <p
        className={cn(
          "mt-8 max-w-2xl scroll-mt-40 text-[16px] leading-relaxed text-foreground/85 sm:text-[18px]",
          "whitespace-pre-line",
          !open && needsExpand ? "line-clamp-6" : "",
        )}
        data-content-field={editable ? "overview" : undefined}
        data-content-id={editable ? speciesId : undefined}
        ref={textRef}
      >
        <PhoneLinkedText>{body}</PhoneLinkedText>
      </p>
      {needsExpand ? (
        <button
          aria-expanded={open}
          className="mt-4 text-[13px] font-medium text-primary transition-colors hover:text-primary/80"
          onClick={toggle}
          ref={buttonRef}
          type="button"
        >
          {open ? readLess : readMore}
        </button>
      ) : null}
    </>
  );
}
