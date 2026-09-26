"use client";

import { useState } from "react";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { cn } from "@/lib/cn";

type BiologyExpandableProps = {
  body: string;
  editorField?: string;
  needsExpand: boolean;
  readLess: string;
  readMore: string;
  speciesId?: string;
};

export function BiologyExpandable({
  body,
  editorField,
  needsExpand,
  readLess,
  readMore,
  speciesId,
}: BiologyExpandableProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <p
        className={cn(
          "mt-4 text-[15px] leading-relaxed text-muted-foreground",
          "whitespace-pre-line",
          !open && needsExpand && !editorField ? "line-clamp-3" : "",
        )}
        data-content-field={editorField}
        data-content-id={speciesId}
      >
        <PhoneLinkedText>{body}</PhoneLinkedText>
      </p>
      {needsExpand && !editorField ? (
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
