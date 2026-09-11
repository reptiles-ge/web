"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

type SpeciesHeroDescriptionProps = {
  body: string;
  readLess: string;
  readMore: string;
};

const PREVIEW_LENGTH = 320;

export function SpeciesHeroDescription({
  body,
  readLess,
  readMore,
}: SpeciesHeroDescriptionProps) {
  const [open, setOpen] = useState(false);
  const needsExpand = body.length > PREVIEW_LENGTH;

  return (
    <div className="mt-4 max-w-xl sm:mt-5">
      <p
        className={cn(
          "text-[15px] leading-relaxed text-white/70 sm:text-[16px]",
          !open && needsExpand ? "line-clamp-4" : "",
        )}
      >
        {body}
      </p>
      {needsExpand ? (
        <button
          aria-expanded={open}
          className="mt-3 text-[13px] font-medium text-white/80 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? readLess : readMore}
        </button>
      ) : null}
    </div>
  );
}
