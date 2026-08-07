"use client";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { useTranslations } from "next-intl";
import { useState } from "react";

type BiologyBlockProps = {
  title: string;
  body: string;
  headingId?: string;
  delay?: number;
};

const PREVIEW_LENGTH = 140;

export function BiologyBlock({ title, body, headingId }: BiologyBlockProps) {
  const t = useTranslations("profile");
  const needsExpand = body.length > PREVIEW_LENGTH;
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="h-px w-12 bg-gold" />
      <AnchoredHeading
        as="h3"
        id={headingId}
        slugSource={title}
        className="mt-6 font-display text-[22px] font-medium"
        anchorLabel={t("anchorLink")}
      >
        {title}
      </AnchoredHeading>
      <p
        className={`mt-4 text-[15px] leading-relaxed text-muted-foreground ${
          !open && needsExpand ? "line-clamp-3" : ""
        }`}
      >
        {body}
      </p>
      {needsExpand ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="mt-4 text-[13px] font-medium text-primary transition-colors hover:text-primary/80"
        >
          {open ? t("readLess") : t("readMore")}
        </button>
      ) : null}
    </div>
  );
}
