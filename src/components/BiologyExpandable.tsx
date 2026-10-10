"use client";

import { useEffect, useState } from "react";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { cn } from "@/lib/cn";
import { useExpandableText } from "@/lib/useExpandableText";

type BiologyExpandableProps = {
  body: string;
  collapseEditable?: boolean;
  editorField?: string;
  needsExpand: boolean;
  readLess: string;
  readMore: string;
  speciesId?: string;
};

const PREVIEW_LINES = 3;

export function BiologyExpandable({
  body,
  collapseEditable = false,
  editorField,
  needsExpand,
  readLess,
  readMore,
  speciesId,
}: BiologyExpandableProps) {
  const { buttonRef, open, textRef, toggle } = useExpandableText(PREVIEW_LINES);
  const [overflows, setOverflows] = useState(false);
  const canCollapse = needsExpand && (collapseEditable || !editorField);

  useEffect(() => {
    const text = textRef.current;
    if (!text || !canCollapse) return;

    const measure = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(text).lineHeight);
      setOverflows(text.scrollHeight > lineHeight * PREVIEW_LINES + 1);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(text);
    const frame = window.requestAnimationFrame(measure);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [body, canCollapse, textRef]);

  return (
    <>
      <p
        className={cn(
          "mt-4 scroll-mt-40 text-[16px] leading-relaxed text-muted-foreground",
          "whitespace-pre-line",
          !open && canCollapse ? "line-clamp-3" : "",
        )}
        data-content-field={editorField}
        data-content-id={speciesId}
        ref={textRef}
      >
        <PhoneLinkedText>{body}</PhoneLinkedText>
      </p>
      {canCollapse && overflows ? (
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
