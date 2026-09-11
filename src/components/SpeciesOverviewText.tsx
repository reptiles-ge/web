"use client";

import { useState } from "react";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { cn } from "@/lib/cn";

type SpeciesOverviewTextProps = {
  body: string;
  readLess: string;
  readMore: string;
};

const PREVIEW_LENGTH = 520;

export function SpeciesOverviewText({
  body,
  readLess,
  readMore,
}: SpeciesOverviewTextProps) {
  const [open, setOpen] = useState(false);
  const needsExpand = body.length > PREVIEW_LENGTH;

  return (
    <>
      <p
        className={cn(
          "mt-8 max-w-2xl text-[16px] leading-relaxed text-foreground/85 sm:text-[18px]",
          !open && needsExpand ? "line-clamp-6" : "",
        )}
      >
        <PhoneLinkedText>{body}</PhoneLinkedText>
      </p>
      {needsExpand ? (
        <button
          aria-expanded={open}
          className="mt-4 text-[13px] font-medium text-primary transition-colors hover:text-primary/80"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? readLess : readMore}
        </button>
      ) : null}
    </>
  );
}
