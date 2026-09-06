"use client";

import { useState } from "react";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { cn } from "@/lib/cn";

type BiologyExpandableProps = {
  body: string;
  needsExpand: boolean;
  readLess: string;
  readMore: string;
};

export function BiologyExpandable({
  body,
  needsExpand,
  readLess,
  readMore,
}: BiologyExpandableProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <p
        className={cn(
          "mt-4 text-[15px] leading-relaxed text-muted-foreground",
          !open && needsExpand ? "line-clamp-3" : "",
        )}
      >
        <PhoneLinkedText>{body}</PhoneLinkedText>
      </p>
      {needsExpand ? (
        <button
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
