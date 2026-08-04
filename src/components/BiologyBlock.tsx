"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { useState } from "react";

type BiologyBlockProps = {
  title: string;
  body: string;
  delay?: number;
};

const PREVIEW_LENGTH = 140;

export function BiologyBlock({ title, body }: BiologyBlockProps) {
  const { t } = useLocale();
  const needsExpand = body.length > PREVIEW_LENGTH;
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="h-px w-12 bg-gold" />
      <h3 className="mt-6 font-display text-[22px] font-medium">{title}</h3>
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
          {open ? t.profile.readLess : t.profile.readMore}
        </button>
      ) : null}
    </div>
  );
}
