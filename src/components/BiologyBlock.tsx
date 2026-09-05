"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { cn } from "@/lib/cn";

type BiologyBlockProps = {
  body: string;
  delay?: number;
  headingId?: string;
  title: string;
};

const PREVIEW_LENGTH = 140;

export function BiologyBlock({ body, headingId, title }: BiologyBlockProps) {
  const t = useTranslations("profile");
  const needsExpand = body.length > PREVIEW_LENGTH;
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="h-px w-12 bg-gold" />
      <AnchoredHeading
        anchorLabel={t("anchorLink")}
        as="h3"
        className="mt-6 font-display text-[22px] font-medium"
        id={headingId}
        slugSource={title}
      >
        {title}
      </AnchoredHeading>
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
          {open ? t("readLess") : t("readMore")}
        </button>
      ) : null}
    </div>
  );
}
