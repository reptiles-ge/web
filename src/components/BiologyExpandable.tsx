"use client";

import { useEffect, useState } from "react";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { cn } from "@/lib/cn";
import { useExpandableText } from "@/lib/useExpandableText";

type BiologyExpandableProps = {
  body: string;
  editorField?: string;
  needsExpand: boolean;
  readLess: string;
  readMore: string;
  speciesId?: string;
};

const PREVIEW_LINES = 3;

export function BiologyExpandable({
  body,
  editorField,
  needsExpand,
  readLess,
  readMore,
  speciesId,
}: BiologyExpandableProps) {
  const { buttonRef, open, textRef, toggle } = useExpandableText(PREVIEW_LINES);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const text = textRef.current;
    if (!text || !needsExpand || editorField) return;

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
  }, [body, editorField, needsExpand, textRef]);

  return (
    <>
      <p
        className={cn(
          "mt-4 scroll-mt-40 text-[15px] leading-relaxed text-muted-foreground",
          "whitespace-pre-line",
          !open && needsExpand && !editorField ? "line-clamp-3" : "",
        )}
        data-content-field={editorField}
        data-content-id={speciesId}
        ref={textRef}
      >
        <PhoneLinkedText>{body}</PhoneLinkedText>
      </p>
      {needsExpand && overflows && !editorField ? (
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
